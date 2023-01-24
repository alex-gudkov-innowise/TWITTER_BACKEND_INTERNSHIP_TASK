import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecordsEntity } from 'src/records/entities/records.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

import { ClosedRecordsEntity } from './closed-records.entity';

export enum Actions {
    create = 'create',
    delete = 'delete',
    manage = 'manage',
    read = 'read',
    update = 'update',
}

@Injectable()
export class AbilityFactory {
    constructor(
        @InjectRepository(ClosedRecordsEntity)
        private readonly closedRecordsRepository: Repository<ClosedRecordsEntity>,
    ) {}

    public async defineAbility(currentUser: UsersEntity, author: UsersEntity, record: RecordsEntity) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        if (currentUser.id === author.id) {
            can(Actions.delete, 'records');
        }

        const closedRecord = await this.closedRecordsRepository.findOne({
            where: {
                fromUser: currentUser,
                author,
                record,
            },
        });

        if (!closedRecord) {
            can(Actions.read, 'records');
        }

        return build();
    }
}
