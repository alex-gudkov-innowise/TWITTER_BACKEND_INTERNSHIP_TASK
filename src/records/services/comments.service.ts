import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { RestrictionsEntity } from 'src/restrictions/restrictions.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public createRestrictionToCreateComments(
        targetUser: UsersEntity,
        initiatorUser: UsersEntity,
    ): Promise<RestrictionsEntity> {
        if (targetUser.id === initiatorUser.id) {
            throw new BadRequestException('user cannot restrict himself');
        }

        const restriction = this.restrictionsRepository.create({
            targetUser,
            initiatorUser,
            action: 'create',
            subject: 'comments',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public createRestrictionToReadComments(
        targetUser: UsersEntity,
        initiatorUser: UsersEntity,
    ): Promise<RestrictionsEntity> {
        if (targetUser.id === initiatorUser.id) {
            throw new BadRequestException('user cannot restrict himself');
        }

        const restriction = this.restrictionsRepository.create({
            targetUser,
            initiatorUser,
            action: 'read',
            subject: 'comments',
        });

        return this.restrictionsRepository.save(restriction);
    }

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

    public async getCommentByIdOrThrow(commentId: string): Promise<RecordsEntity> {
        const comment = await this.recordsTreeRepository.findOne({
            where: {
                id: commentId,
                isRetweet: false,
                isComment: true,
            },
            relations: {
                images: true,
            },
        });

        if (!comment) {
            throw new NotFoundException({ message: 'comment not found' });
        }

        return comment;
    }

    public async createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (createCommentDto.text === '' && imageFiles.length === 0) {
            throw new BadRequestException('comment cannot be empty');
        }

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

    public getRecordUpperLevelComments(record: RecordsEntity): Promise<RecordsEntity[]> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        // return this.recordsTreeRepository
        //     .createQueryBuilder('records')
        //     .where(`records."parentId" = :recordId`, { recordId: record.id })
        //     .getMany();

        return this.recordsTreeRepository.find({
            where: {
                parent: record,
                isComment: true,
            },
            relations: {
                images: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
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

    public async clearCommentAndMarkAsDeleted(comment: RecordsEntity): Promise<RecordsEntity> {
        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        const commentImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :commentId`, { commentId: comment.id })
            .getMany();

        commentImages.forEach((commentImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(commentImage.name);
            this.recordImagesRepository.delete(commentImage);
        });

        comment.text = '';
        comment.isDeleted = true;

        return this.recordsTreeRepository.save(comment);
    }
}
