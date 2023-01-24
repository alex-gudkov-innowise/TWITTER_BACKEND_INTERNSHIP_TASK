import { ForbiddenError } from '@casl/ability';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { CheckAbilityDecorator } from 'src/decorators/check-ability.decorator';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AbilityGuard } from 'src/guards/ability.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';

import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/all')
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('/:userId')
    public getUserById(@Param('userId') userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    @UseGuards(AbilityGuard)
    @CheckAbilityDecorator({ action: 'delete', subject: 'users' })
    public async deleteUser(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.usersService.deleteUser(user);
    }
}
