import { ForbiddenError } from '@casl/ability';
import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NotFoundError } from 'rxjs';

import { AbilityToCheck, METADATA_KEY_CHECK_ABILITY } from 'src/decorators/check-ability.decorator';
import { RequestWithParamsUserId } from 'src/interfaces/request-with-params.interface';
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
        const request = context.switchToHttp().getRequest<RequestWithUser & RequestWithParamsUserId>();
        const targetUser = request.currentUser;
        const initiatorUser = await this.usersService.getUserById(request.params.userId);
        const abilityToCheck = this.reflector.get<AbilityToCheck>(METADATA_KEY_CHECK_ABILITY, context.getHandler());

        if (!targetUser) {
            throw new NotFoundException('target user not found');
        }

        if (!initiatorUser) {
            throw new NotFoundException('initiator user not found');
        }

        const currentUserAbility = await this.caslAbilityFactory.defineAbility(targetUser, initiatorUser);
        ForbiddenError.from(currentUserAbility).throwUnlessCan(abilityToCheck.action, abilityToCheck.subject);

        return true;
    }
}
