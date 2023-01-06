import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }
}
