import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
    ) {}

    public getRecordById(recordId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                author: true,
                images: true,
            },
        });
    }

    public getRecordByIdOrThrow(recordId: string): Promise<RecordsEntity> {
        const record = this.recordsTreeRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                author: true,
                images: true,
            },
        });

        if (!record) {
            throw new NotFoundException('record not found');
        }

        return record;
    }

    public async getAllPosts(): Promise<RecordsEntity[]> {
        const posts = await this.recordsTreeRepository.find({
            where: {
                isComment: false,
            },
        });

        return posts;
    }
}
