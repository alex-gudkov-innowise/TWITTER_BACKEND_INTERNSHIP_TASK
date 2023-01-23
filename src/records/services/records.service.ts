import { Injectable } from '@nestjs/common';
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
                images: true,
            },
        });
    }
}