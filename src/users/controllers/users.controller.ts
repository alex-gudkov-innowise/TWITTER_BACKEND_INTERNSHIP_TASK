import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';

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
    public async deleteUser(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.usersService.deleteUser(user);
    }
}
