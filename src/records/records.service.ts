import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { ImagesEntity } from './images.entity';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(ImagesEntity) private readonly imagesRepository: Repository<ImagesEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getUserTweets(user: UsersEntity): Promise<RecordsEntity[] | null> {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
                author: user,
            },
            relations: {
                images: true,
            },
        });
    }

    public getRecordById(recordId: any): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                images: true,
            },
        });
    }

    public async createTweet(
        dto: CreateRecordDto,
        author: UsersEntity,
        imageFiles: Array<Express.Multer.File>,
    ): Promise<RecordsEntity> {
        const tweet = this.recordsTreeRepository.create({
            text: dto.text,
            isComment: false,
            author,
        });

        await this.recordsTreeRepository.save(tweet);

        imageFiles.forEach(async (imageFile) => {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const image = this.imagesRepository.create({
                name: fileName,
                record: tweet,
            });

            await this.imagesRepository.save(image);
        });

        return tweet;
    }

    public createComment(dto: CreateRecordDto, author: UsersEntity, record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const comment = this.recordsTreeRepository.create({
            text: dto.text,
            isComment: true,
            author,
            parent: record,
        });

        return this.recordsTreeRepository.save(comment);
    }

    public async getRecordCommentsTree(record: RecordsEntity): Promise<RecordsEntity | null> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const recordDescendantsTree = await this.recordsTreeRepository.findDescendantsTree(record, {
            relations: ['images'],
        });

        const recordCommentsTree = this.filterRecordDescendantsTreeForComments(recordDescendantsTree);

        return recordCommentsTree;
    }

    private filterRecordDescendantsTreeForComments(recordDescendantsTree: RecordsEntity): RecordsEntity {
        recordDescendantsTree.children = recordDescendantsTree.children.filter((childRecord: RecordsEntity) => {
            if (childRecord.isComment) {
                childRecord = this.filterRecordDescendantsTreeForComments(childRecord);

                return true;
            } else {
                return false;
            }
        });

        return recordDescendantsTree;
    }

    public async removeRecord(record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const recordImages = await this.imagesRepository
            .createQueryBuilder('images')
            .where(`images."recordId" = :recordId`, { recordId: record.id })
            .getMany();

        recordImages.forEach(async (recordImage: ImagesEntity) => {
            await this.filesService.removeImageFile(recordImage.name);
        });

        await this.imagesRepository.remove(recordImages);

        return this.recordsTreeRepository.remove(record);
    }
}
