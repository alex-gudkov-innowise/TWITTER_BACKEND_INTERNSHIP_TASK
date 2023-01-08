import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/')
    public getAllUsers(@CurrentUser() currentUser: UsersEntity) {
        console.log(currentUser);

        return this.usersService.getAllUsers();
    }
}
