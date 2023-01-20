import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheConfig } from 'cache-config';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensEntity } from './refresh-tokens.entity';
import { UsersSessionsEntity } from './users-sessions.entity';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.register({}),
        TypeOrmModule.forFeature([RefreshTokensEntity, UsersEntity, UsersSessionsEntity]),
        MailerModule,
        CacheModule.registerAsync({ useClass: CacheConfig }),
    ],
})
export class AuthModule {}
