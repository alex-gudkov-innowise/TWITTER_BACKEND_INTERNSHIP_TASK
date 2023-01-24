import { ForbiddenError } from '@casl/ability';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';

import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly caslAbilityFactory: CaslAbilityFactory) {}

    @Get('/all')
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('/:userId')
    public getUserById(@Param('userId') userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    public async deleteUser(@Param('userId') userId: string, @CurrentUserDecorator() currentUser: UsersEntity) {
        const user = await this.usersService.getUserById(userId);

        const currentUserAbility = await this.caslAbilityFactory.defineAbility(currentUser, user);
        ForbiddenError.from(currentUserAbility).throwUnlessCan('delete', 'users');

        return this.usersService.deleteUser(user);
    }
}
