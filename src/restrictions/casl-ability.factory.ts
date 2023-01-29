import { AbilityBuilder, MongoAbility, createMongoAbility } from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/interfaces/permission.interface';
import { RequestWithParamsUserId } from 'src/interfaces/request-with-params.interface';
import { RequestWithUserRoles } from 'src/interfaces/request-with-user-roles.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { defaultPermissions } from './default-permissions';
import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class CaslAbilityFactory {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
        @Inject(REQUEST) private readonly request: RequestWithUser & RequestWithParamsUserId & RequestWithUserRoles,
        private readonly usersService: UsersService,
    ) {}

    public async defineAbilityToReadTweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ) {
        const { build, can } = new AbilityBuilder<MongoAbility>(createMongoAbility);

        if (targetUserRoles.includes('admin')) {
            can('read', 'tweets');

            return build();
        }

        const isRestrictionExist = await this.restrictionsRepository.exist({
            where: {
                targetUser,
                initiatorUser,
                action: 'read',
                subject: 'tweets',
            },
        });

        if (!isRestrictionExist) {
            can('read', 'tweets');
        }

        return build();
    }

    public async defineAbility(targetUser: UsersEntity, initiatorUser: UsersEntity, targetUserRoles: string[]) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        defaultPermissions.forEach((defaultPermission: Permission) => {
            can(defaultPermission.action, defaultPermission.subject);
        });

        if (targetUserRoles.includes('admin')) {
            can('delete', 'users');

            return build();
        }

        if (targetUser.id === initiatorUser.id) {
            can('delete', 'users');
        }

        const restrictions = await this.restrictionsRepository.find({
            where: {
                targetUser,
                initiatorUser,
            },
        });

        restrictions.forEach((restriction: RestrictionsEntity) => {
            cannot(restriction.action, restriction.subject);
        });

        return build();
    }
}
