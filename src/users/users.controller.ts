import { Controller, Get, UseGuards } from '@nestjs/common';

import { PrivacyInfo, PrivacyInfoDecorator } from 'src/decorators/privacy-info.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/')
    public getAllUsers(@PrivacyInfoDecorator() privacyInfo: PrivacyInfo) {
        console.log(privacyInfo);

        return this.usersService.getAllUsers();
    }
}
