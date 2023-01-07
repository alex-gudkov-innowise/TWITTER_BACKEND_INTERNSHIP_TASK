import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    CACHE_MANAGER,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
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
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    public async signUpUser(dto: SignUpUserDto) {
        const candidateUser = await this.usersService.getUserByEmail(dto.email);

        if (candidateUser) {
            throw new BadRequestException({ message: 'user already exists' });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');

        await this.cacheManager.set(verificationCode, dto);
        this.sendConfirmationEmail(dto.email, verificationCode);

        return { message: 'verification code was sent' };
    }

    public async confirmEmail(verificationCode: string) {
        const dto = await this.cacheManager.get<SignUpUserDto>(verificationCode);

        if (!dto) {
            throw new BadRequestException({ message: 'invalid verification code' });
        }

        await this.cacheManager.del(verificationCode);

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
        const user = await this.usersService.getUserByEmail(dto.email);

        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        const comparedPasswords = await bcrypt.compare(dto.password, user.password);

        if (!comparedPasswords) {
            throw new UnauthorizedException({ message: 'wrong password' });
        }

        return {
            accessToken: this.generateAccessToken(user.id),
            refreshToken: await this.generateRefreshToken(user.id),
        };
    }

    public async signOutUser(refreshTokenValue: string) {
        await this.refreshTokensRepository.delete({ value: refreshTokenValue });

        return { message: 'user signed out' };
    }

    private async sendConfirmationEmail(userEmail: string, verificationCode: string) {
        try {
            this.mailerService.sendMail({
                to: userEmail,
                subject: `${verificationCode} is your Twitter verification code`,
                html: `
                    <h2>      
                        Confirm your email address
                    </h2>
                    <p style="font-family:Helvetica; font-size:16px;">
                        There’s one quick step you need to complete before creating your Twitter account. Let’s make sure this is the right email address for you – please confirm this is the right address to use for your new account.
                    </p>
                    <p style="font-family:Helvetica; font-size:16px;">
                        Please enter this verification code to get started on Twitter:
                    </p>
                    <div style="font-family:Helvetica; font-size:32px; font-weight:bold;">      
                        ${verificationCode}
                    </div>
                    <div style="font-family:Helvetica; font-size:14px;">
                        Verification codes expire after two hours
                    </div>
                    <div style="font-family:Helvetica; font-size:16px; margin-top:24px;">
                        Thanks,
                        <br>    
                        Twitter
                    </div>
                    <br>
                    <br>
                    <span style="margin-bottom:32px; color:#8899a6; font-size: 12px; text-align: center;">
                        Twitter, Inc.
                    </span>
                    <br>
                `,
                from: 'Twitter <alex-mailer@mail.ru>',
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    private generateAccessToken(userId: number) {
        const payload = {
            userId,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        });

        return accessToken;
    }

    private async generateRefreshToken(userId: number) {
        const payload = {
            userId,
        };
        const refreshTokenValue = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        });

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
            const payload = this.jwtService.verify(refreshTokenValue, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            });

            return {
                accessToken: this.generateAccessToken(payload.userId),
            };
        } catch (error) {
            await this.refreshTokensRepository.delete({ value: refreshTokenValue });
            throw new UnauthorizedException({ message: 'refresh token is expired' });
        }
    }
}
