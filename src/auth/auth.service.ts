import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    public async signUpUser(dto: SignUpUserDto) {
        // check that the user still not registered
        const candidateUser = await this.usersService.getUserByEmail(dto.email);

        if (candidateUser) {
            throw new BadRequestException({ message: 'user already exists' });
        }

        // create user
        const hashedPassword = await bcrypt.hash(dto.password, 4);
        const user = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
        });

        // return generated tokens
        return {
            accessToken: this.generateAccessToken(user.id),
        };
    }

    public async signInUser(dto: SignInUserDto) {
        // validate the user and get it if the data is valid
        const user = await this.validateUser(dto);

        // return generated tokens
        return {
            accessToken: this.generateAccessToken(user.id),
        };
    }

    private async validateUser(dto: SignInUserDto) {
        // check that this user is registered
        const user = await this.usersService.getUserByEmail(dto.email);

        if (!user) {
            throw new BadRequestException({ message: 'user already exists' });
        }

        // check the password correctness
        const comparedPasswords = await bcrypt.compare(dto.password, user.password);

        if (!comparedPasswords) {
            throw new UnauthorizedException({ message: 'wrong password' });
        }

        return user;
    }

    private generateAccessToken(userId: number) {
        // payload object is stored in token
        const payload = {
            userId,
        };

        // sign a new token
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        });

        return accessToken;
    }
}
