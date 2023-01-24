import { Controller, Delete, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';

import { AbilityFactory } from 'src/ability/ability.factory';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly abilityFactory: AbilityFactory) {}

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

        const currentUserAbility = await this.abilityFactory.defineAbility(currentUser, user);
        const isCanDeleteUser = currentUserAbility.can('delete', 'users');

        if (!isCanDeleteUser) {
            throw new ForbiddenException('cannot delete user');
        }

        return this.usersService.deleteUser(user);
    }
}
