import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    public async signUpUser(dto: SignUpUserDto) {
        await this.usersService.createUser(dto);

        return 'access token';
    }
}
