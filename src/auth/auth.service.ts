import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    public async signUpUser(dto: SignUpUserDto) {
        // check that the user still not registered
        const candidateUser = await this.usersService.getUserByEmail(dto.email);

        if (candidateUser) {
            throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }

        // create user
        const hashedPassword = await bcrypt.hash(dto.password, 4);
        const user = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
        });

        // return generated tokens
        return 'access token for ' + user.id;
    }

    public async signInUser(dto: SignInUserDto) {
        // validate the user and get it if the data is valid
        const user = await this.validateUser(dto);

        // return generated tokens
        return 'access token for ' + user.id;
    }

    private async validateUser(dto: SignInUserDto) {
        // check that this user is registered
        const user = await this.usersService.getUserByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException({ message: 'user not found' });
        }

        // check the password correctness
        const comparedPasswords = await bcrypt.compare(dto.password, user.password);

        if (!comparedPasswords) {
            throw new UnauthorizedException({ message: 'wrong password' });
        }

        return user;
    }
}
