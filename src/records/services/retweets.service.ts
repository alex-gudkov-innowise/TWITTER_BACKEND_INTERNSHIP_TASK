import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';
import { CreateRetweetDto } from '../dto/create-retweet.dto';

@Injectable()
export class RetweetsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getUserRetweets(user: UsersEntity): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
                isRetweet: true,
                author: user,
            },
            relations: {
                images: true,
            },
        });
    }

    public getRetweetById(retweetId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: retweetId,
                isRetweet: true,
                isComment: false,
            },
            relations: {
                images: true,
            },
        });
    }

    public async createRetweetOnRecord(
        createRetweetDto: CreateRetweetDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const retweet = this.recordsTreeRepository.create({
            text: createRetweetDto.text,
            isComment: false,
            isRetweet: true,
            author,
            parent: record,
        });

        await this.recordsTreeRepository.save(retweet);

        imageFiles.forEach(async (imageFile) => {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const image = this.recordImagesRepository.create({
                name: fileName,
                record: retweet,
            });

            await this.recordImagesRepository.save(image);
        });

        return retweet;
    }

    public async removeRetweet(retweet: RecordsEntity) {
        if (!retweet) {
            throw new NotFoundException({ message: 'retweet not found' });
        }

        const retweetImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :retweetId`, { retweetId: retweet.id })
            .getMany();

        retweetImages.forEach((recordImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(recordImage.name);
        });

        await this.recordImagesRepository.remove(retweetImages);

        return this.recordsTreeRepository.remove(retweet);
    }
}
