import { AbilityBuilder, MongoAbility, PureAbility, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/interfaces/permission.interface';
import { UsersEntity } from 'src/users/entities/users.entity';

import { defaultPermissions } from './default-permissions';
import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class CaslAbilityFactory {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public defineAbilityToReadTweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'read', 'tweets');
    }

    public async defineVisitorAbility(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
        action: string,
        subject: string,
    ): Promise<PureAbility> {
        const { build, can } = new AbilityBuilder<MongoAbility>(createMongoAbility);

        if (targetUserRoles.includes('admin')) {
            can(action, subject);
        } else {
            const isRestrictionExist = await this.restrictionsRepository.exist({
                where: {
                    targetUser,
                    initiatorUser,
                    action,
                    subject,
                },
            });

            if (!isRestrictionExist) {
                can(action, subject);
            }
        }

        return build();
    }
}
