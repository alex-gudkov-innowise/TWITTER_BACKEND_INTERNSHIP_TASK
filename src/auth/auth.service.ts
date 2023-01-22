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
import * as bcryptjs from 'bcryptjs';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { SentMessageInfo } from 'nodemailer';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';
import { UserSessionEntity } from 'src/interfaces/session-entity.interface';
import { UsersEntity } from 'src/users/users.entity';
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

    public async signUpUser(dto: SignUpUserDto): Promise<SentMessageInfo> {
        const candidateUser = await this.usersService.getUserByEmail(dto.email);
        if (candidateUser) {
            throw new BadRequestException({ message: 'user already exists' });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');
        await this.cacheManager.set(verificationCode, dto);

        return this.sendConfirmationEmail(dto.email, verificationCode);
    }

    public async confirmEmail(verificationCode: string, privacyInfo: PrivacyInfo) {
        const dto = await this.cacheManager.get<SignUpUserDto>(verificationCode);

        if (!dto) {
            throw new BadRequestException({ message: 'invalid verification code' });
        }

        await this.cacheManager.del(verificationCode);

        const hashedPassword = await bcryptjs.hash(dto.password, 4);
        const user = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
        });

        const accessToken = this.createAccessToken(user);
        const userSession = await this.createUserSession(user, privacyInfo);
        const refreshToken = await this.createRefreshToken(user, userSession);

        // delete extra sessions...

        return {
            accessToken,
            refreshToken: refreshToken.value,
        };
    }

    public async signInUser(dto: SignInUserDto, privacyInfo: PrivacyInfo) {
        const user = await this.usersService.getUserByEmail(dto.email);
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        const comparedPasswords = await bcryptjs.compare(dto.password, user.password);
        if (!comparedPasswords) {
            throw new UnauthorizedException({ message: 'wrong password' });
        }

        const accessToken = this.createAccessToken(user);
        const userSession = await this.createUserSession(user, privacyInfo);
        const refreshToken = await this.createRefreshToken(user, userSession);

        // delete extra sessions...

        await this.sendLoginNotificationEmail(dto.email, privacyInfo);

        return {
            accessToken,
            refreshToken: refreshToken.value,
        };
    }

    public async signOutUser(refreshTokenValue: string): Promise<RefreshTokensEntity> {
        const refreshToken = await this.refreshTokensRepository.findOneBy({ value: refreshTokenValue });

        await this.cacheManager.del(refreshToken.sessionId);

        return this.refreshTokensRepository.remove(refreshToken);
    }

    private async createUserSession(user: UsersEntity, privacyInfo: PrivacyInfo): Promise<UserSessionEntity> {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        const userSession: UserSessionEntity = {
            id: uuid.v4(),
            userId: user.id,
            privacyInfo,
            loggedAt: new Date(),
        };
        const sessionLifetimeInSeconds = this.configService.get<number>('SESSION_LIFETIME_IN_SECONDS');

        await this.cacheManager.set(userSession.id, userSession, sessionLifetimeInSeconds);

        return userSession;
    }

    public async getAllUserSessions(user: UsersEntity): Promise<UserSessionEntity[] | null> {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        const usersRefreshTokens = await this.refreshTokensRepository.findBy({ user });

        const userSessions = await Promise.all(
            usersRefreshTokens.map((refreshToken: RefreshTokensEntity): Promise<UserSessionEntity> => {
                return this.cacheManager.get<UserSessionEntity>(refreshToken.sessionId);
            }),
        );

        return userSessions;
    }

    public getSessionById(sessionId: string) {
        return this.cacheManager.get<UserSessionEntity>(sessionId);
    }

    private sendLoginNotificationEmail(userEmail: string, privacyInfo: PrivacyInfo): Promise<SentMessageInfo> {
        return this.mailerService.sendMail({
            to: userEmail,
            subject: `Security alert for ${userEmail}`,
            html: `
                <div style="font-family:Helvetica;">
                    <h2>      
                        A new sign-in
                    </h2>
                    <p style="font-size:16px;">
                        We noticed a new sign-in to your Twitter Account. If this was you, you don’t need to do anything. If not, take care of your account security.
                    </p>
                    <div style="font-size:16px; font-style: italic;">      
                        Ip Address: ${privacyInfo.ipAddress}
                        <br>
                        User Agent: ${privacyInfo.userAgent}
                    </div>
                    <br>
                </div>
            `,
            from: 'Twitter <alex-mailer@mail.ru>',
        });
    }

    private sendConfirmationEmail(userEmail: string, verificationCode: string): Promise<SentMessageInfo> {
        return this.mailerService.sendMail({
            to: userEmail,
            subject: `${verificationCode} is your Twitter verification code`,
            html: `
                <div style="font-family:Helvetica;">
                    <h2>      
                        Confirm your email address
                    </h2>
                    <p style="font-size:16px;">
                        There’s one quick step you need to complete before creating your Twitter account. Let’s make sure this is the right email address for you – please confirm this is the right address to use for your new account.
                    </p>
                    <p style="font-size:16px;">
                        Please enter this verification code to get started on Twitter:
                    </p>
                    <div style="font-size:32px; font-weight:bold;">      
                        ${verificationCode}
                    </div>
                    <div style="font-family:Helvetica; font-size:14px;">
                        Verification codes expire after two hours
                    </div>
                    <div style="font-size:16px; margin-top:24px;">
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
                </div>
            `,
            from: 'Twitter <alex-mailer@mail.ru>',
        });
    }

    private createAccessToken(user: UsersEntity): string {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        const payload = {
            userId: user.id,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        });

        return accessToken;
    }

    private createRefreshToken(user: UsersEntity, userSession: UserSessionEntity): Promise<RefreshTokensEntity> {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        if (!userSession) {
            throw new NotFoundException({ message: 'user session not found' });
        }

        const refreshToken = this.refreshTokensRepository.create({
            value: uuid.v4(),
            user,
            sessionId: userSession.id,
        });

        return this.refreshTokensRepository.save(refreshToken);
    }

    public async getNewAccessToken(refreshTokenValue: string) {
        const refreshToken = await this.refreshTokensRepository.findOneBy({ value: refreshTokenValue });
        const userSession = await this.cacheManager.get<UserSessionEntity>(refreshToken.sessionId);

        if (!userSession) {
            throw new NotFoundException({ message: 'user session not found' });
        }

        const user = await this.usersService.getUserById(userSession.userId);

        return {
            accessToken: this.createAccessToken(user),
        };
    }
}
