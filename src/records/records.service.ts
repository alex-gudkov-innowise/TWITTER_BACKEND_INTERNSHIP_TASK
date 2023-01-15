import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(@InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>) {}

    public getUserTweets(user: UsersEntity) {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        return this.recordsRepository.find({
            where: {
                isComment: false,
                author: user,
            },
        });
    }

    public getRecordById(recordId: number): Promise<RecordsEntity | null> {
        return this.recordsRepository.findOneBy({ id: recordId });
    }

    public createTweet(dto: CreateRecordDto, author: UsersEntity): Promise<RecordsEntity> {
        const tweet = this.recordsRepository.create({
            text: dto.text,
            isComment: false,
            author,
        });

        return this.recordsRepository.save(tweet);
    }

    public createComment(dto: CreateRecordDto, author: UsersEntity, record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const comment = this.recordsRepository.create({
            text: dto.text,
            isComment: true,
            author,
            parentRecord: record,
        });

        return this.recordsRepository.save(comment);
    }

    public getRecordComments(record: RecordsEntity): Promise<RecordsEntity[] | null> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        return this.recordsRepository.find({
            where: {
                isComment: true,
                parentRecord: record,
            },
        });
    }
}
