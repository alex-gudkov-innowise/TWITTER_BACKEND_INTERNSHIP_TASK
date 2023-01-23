import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/users.entity';

import { CreateTweetDto } from './dto/create-tweet.dto';
import { RecordImagesEntity } from './record-images.entity';
import { RecordsEntity } from './records.entity';

@Injectable()
export class TweetsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getAllUserTweets(user: UsersEntity): Promise<RecordsEntity[] | null> {
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

    public async createTweet(
        createTweetDto: CreateTweetDto,
        author: UsersEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        const tweet = this.recordsTreeRepository.create({
            text: createTweetDto.text,
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
}
