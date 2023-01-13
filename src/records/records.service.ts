import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(@InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>) {}

    public async getTweetById(tweetId: number): Promise<RecordsEntity | null> {
        return this.recordsRepository.findOneBy({ id: tweetId, isComment: false });
    }

    public async CreateTweet(dto: CreateRecordDto, author: UsersEntity): Promise<RecordsEntity> {
        const tweet = this.recordsRepository.create({
            text: dto.text,
            isComment: false,
            author,
        });

        return this.recordsRepository.save(tweet);
    }

    public async CreateComment(
        dto: CreateRecordDto,
        author: UsersEntity,
        tweet: RecordsEntity,
    ): Promise<RecordsEntity> {
        if (!tweet) {
            throw new NotFoundException({ message: 'tweet not found' });
        }

        const comment = this.recordsRepository.create({
            text: dto.text,
            isComment: true,
            author,
            parentRecord: tweet,
        });

        return this.recordsRepository.save(comment);
    }

    public async getTweetComments(tweet: RecordsEntity): Promise<RecordsEntity[] | null> {
        if (!tweet) {
            throw new NotFoundException({ message: 'tweet not found' });
        }

        return this.recordsRepository.find({
            where: {
                isComment: true,
                parentRecord: tweet,
            },
        });
    }
}
