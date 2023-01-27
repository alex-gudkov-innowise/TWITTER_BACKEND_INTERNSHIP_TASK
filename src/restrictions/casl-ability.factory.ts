import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CurrentUserRoleDecorator } from 'src/decorators/current-user.decorator copy';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class CaslAbilityFactory {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public async defineAbility(targetUser: UsersEntity, initiatorUser: UsersEntity, currentUserRole: string) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        console.log(currentUserRole);

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

        if (targetUser.id === initiatorUser.id) {
            can('delete', 'users');
        }

        return build();
    }
}
