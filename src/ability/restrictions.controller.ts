import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsService } from './restriction.service';

@UseGuards(AuthGuard)
@Controller('/restrictions')
export class UsersController {
    constructor(private readonly restrictionsService: RestrictionsService) {}

    @Get('/')
    public getAllUserRestrictions(@CurrentUserDecorator() currentUser: UsersEntity) {
        return this.restrictionsService.getAllUserRestrictions(currentUser);
    }
}
