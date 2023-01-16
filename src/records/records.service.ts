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

    public async getRecordComments(record: RecordsEntity): Promise<RecordsEntity[] | null> {
        const comments = await this.recordsRepository.query(`
            WITH RECURSIVE comments("id", "text", "authorId", "path") AS (
                SELECT t1."id", t1."text", t1."authorId", CAST(t1."id" AS CHARACTER VARYING) AS "path"
                FROM records AS t1
                WHERE t1."id" = 1
                UNION
                SELECT t2."id", t2."text", t2."authorId", CAST(comments."path" || '->' || t2."id" AS CHARACTER VARYING)
                FROM records AS t2
                JOIN comments ON comments."id" = t2."authorId"
            ) SELECT * FROM comments;
        `);

        return comments;
    }
}
