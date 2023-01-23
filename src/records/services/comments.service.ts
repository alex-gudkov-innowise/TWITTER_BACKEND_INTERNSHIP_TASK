import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dtos/create-comment.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getCommentById(commentId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: commentId,
                isRetweet: false,
                isComment: true,
            },
            relations: {
                images: true,
            },
        });
    }

    public async createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const comment = this.recordsTreeRepository.create({
            text: createCommentDto.text,
            isComment: true,
            isRetweet: false,
            author,
            parent: record,
        });

        await this.recordsTreeRepository.save(comment);

        imageFiles.forEach(async (imageFile) => {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const image = this.recordImagesRepository.create({
                name: fileName,
                record: comment,
            });

            await this.recordImagesRepository.save(image);
        });

        return comment;
    }

    public async getCommentsTree(record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const descendantsTree = await this.recordsTreeRepository.findDescendantsTree(record, {
            relations: ['images'],
        });

        const commentsTree = this.filterDescendantsTreeForCommentsTree(descendantsTree);

        return commentsTree;
    }

    private filterDescendantsTreeForCommentsTree(descendantsTree: RecordsEntity): RecordsEntity {
        descendantsTree.children = descendantsTree.children.filter((child: RecordsEntity) => {
            if (child.isComment) {
                child = this.filterDescendantsTreeForCommentsTree(child);

                return true;
            } else {
                return false;
            }
        });

        return descendantsTree;
    }

    public async removeComment(comment: RecordsEntity) {
        if (!comment) {
            throw new NotFoundException({ message: 'comment not found' });
        }

        const commentImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :commentId`, { commentId: comment.id })
            .getMany();

        commentImages.forEach((recordImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(recordImage.name);
        });

        await this.recordImagesRepository.remove(commentImages);

        return this.recordsTreeRepository.remove(comment);
    }
}
