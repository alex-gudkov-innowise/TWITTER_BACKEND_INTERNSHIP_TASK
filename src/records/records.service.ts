import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(@InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>) {}

    public async CreateTweet(dto: CreateRecordDto, author: UsersEntity) {
        const record = this.recordsRepository.create({
            text: dto.text,
            isComment: false,
            author,
        });

        await this.recordsRepository.save(record);

        return record;
    }
}
