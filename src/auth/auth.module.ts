import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheConfig } from 'src/configs/cache-config';
import { JwtConfig } from 'src/configs/jwt-config';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './controllers/auth.controller';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.registerAsync({ useClass: JwtConfig }),
        TypeOrmModule.forFeature([RefreshTokensEntity, UsersEntity]),
        MailerModule,
        CacheModule.registerAsync({ useClass: CacheConfig }),
    ],
})
export class AuthModule {}
