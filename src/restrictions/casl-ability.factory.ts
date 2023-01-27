import { AbilityBuilder, createMongoAbility } from '@casl/ability';
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

    public async defineAbility(targetUser: UsersEntity, initiatorUser: UsersEntity, targetUserRole: string) {
        const { build, can, cannot } = new AbilityBuilder(createMongoAbility);

        defaultPermissions.forEach((defaultPermission: Permission) => {
            can(defaultPermission.action, defaultPermission.subject);
        });

        if (targetUserRole === 'admin') {
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
