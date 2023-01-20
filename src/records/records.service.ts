import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordImagesEntity } from './record-images.entity';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
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

    public getTweetById(tweetId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: tweetId,
                isRetweet: false,
                isComment: false,
            },
            relations: {
                images: true,
            },
        });
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

    public getRecordById(recordId: string): Promise<RecordsEntity | null> {
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
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        const tweet = this.recordsTreeRepository.create({
            text: dto.text,
            isComment: false,
            isRetweet: false,
            author,
        });

        await this.recordsTreeRepository.save(tweet);

        imageFiles.forEach(async (imageFile) => {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const image = this.recordImagesRepository.create({
                name: fileName,
                record: tweet,
            });

            await this.recordImagesRepository.save(image);
        });

        return tweet;
    }

    public async createRetweet(
        dto: CreateRecordDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const retweet = this.recordsTreeRepository.create({
            text: dto.text,
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

    public async createComment(
        dto: CreateRecordDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const comment = this.recordsTreeRepository.create({
            text: dto.text,
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

    public async removeTweet(tweet: RecordsEntity) {
        if (!tweet) {
            throw new NotFoundException({ message: 'tweet not found' });
        }

        const tweetImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :tweetId`, { tweetId: tweet.id })
            .getMany();

        tweetImages.forEach((recordImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(recordImage.name);
        });

        await this.recordImagesRepository.remove(tweetImages);

        return this.recordsTreeRepository.remove(tweet);
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
