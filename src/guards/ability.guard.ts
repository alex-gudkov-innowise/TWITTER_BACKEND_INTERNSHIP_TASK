import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AbilityToCheck, METADATA_KEY_CHECK_ABILITY } from 'src/decorators/check-ability.decorator';
import { RequestWithParamsUserId } from 'src/interfaces/request-with-params.interface';
import { RequestWithUserRoles } from 'src/interfaces/request-with-user-roles.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AbilityGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly usersService: UsersService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<RequestWithUser & RequestWithParamsUserId & RequestWithUserRoles>();
        const targetUser = request.currentUser;
        const targetUserRoles = request.currentUserRoles;
        const initiatorUser = await this.usersService.getUserById(request.params.userId);
        const abilityToCheck = this.reflector.get<AbilityToCheck>(METADATA_KEY_CHECK_ABILITY, context.getHandler());

        if (!targetUser) {
            throw new NotFoundException('target user not found');
        }

        if (!initiatorUser) {
            throw new NotFoundException('initiator user not found');
        }

        const currentUserAbility = await this.caslAbilityFactory.defineAbility(
            targetUser,
            initiatorUser,
            targetUserRoles,
        );
        const isCurrentUserCan = currentUserAbility.can(abilityToCheck.action, abilityToCheck.subject);

        if (!isCurrentUserCan) {
            throw new ForbiddenException(
                `cannot do action(${abilityToCheck.action}) on subject(${abilityToCheck.subject})`,
            );
        }

        return true;
    }
}
