import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';

import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { RefreshTokensEntity } from './refresh-tokens.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(RefreshTokensEntity)
        private readonly refreshTokensRepository: Repository<RefreshTokensEntity>,
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

        return {
            accessToken: this.generateAccessToken(user.id),
            refreshToken: await this.generateRefreshToken(user.id),
        };
    }

    public async signInUser(dto: SignInUserDto) {
        // validate the user and get it if the data is valid
        const user = await this.validateUser(dto);

        return {
            accessToken: this.generateAccessToken(user.id),
            refreshToken: await this.generateRefreshToken(user.id),
        };
    }

    public async signOutUser(refreshTokenValue: string) {
        // delete refreshToken from database
        await this.refreshTokensRepository.delete({ value: refreshTokenValue });
    }

    private async validateUser(dto: SignInUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);

        if (!user) {
            throw new BadRequestException({ message: 'user already exists' });
        }

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

    private async generateRefreshToken(userId: number) {
        // sign a new token
        const payload = {
            userId,
        };
        const refreshTokenValue = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        });

        // add token to database
        const user = await this.usersService.getUserById(userId);
        const refreshToken = this.refreshTokensRepository.create({
            value: refreshTokenValue,
            user,
        });

        await this.refreshTokensRepository.save(refreshToken);

        return refreshTokenValue;
    }

    public async getNewAccessToken(refreshTokenValue: string) {
        try {
            // verify refresh token
            const payload = this.jwtService.verify(refreshTokenValue, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            });

            return {
                accessToken: this.generateAccessToken(payload.userId),
            };
        } catch (error) {
            // delete expired token from database
            await this.refreshTokensRepository.delete({ value: refreshTokenValue });
            throw new UnauthorizedException({ message: 'refresh token is expired' });
        }
    }
}
