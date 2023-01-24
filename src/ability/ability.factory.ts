import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class AbilityFactory {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public async defineAbility(targetUser: UsersEntity, initiatorUser: UsersEntity) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        const restrictions = await this.restrictionsRepository.find({
            where: {
                targetUser,
                initiatorUser,
            },
        });

        can('read', 'tweets');
        can('read', 'retweets');
        can('create', 'retweets');
        can('create', 'comments');

        restrictions.forEach((restrictions) => {
            cannot(restrictions.action, restrictions.subject);
        });

        return build();
    }
}
