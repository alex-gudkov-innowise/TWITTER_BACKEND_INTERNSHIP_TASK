import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensEntity } from './refresh-tokens.entity';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        ConfigModule,
        JwtModule.register({}),
        TypeOrmModule.forFeature([RefreshTokensEntity, UsersEntity]),
    ],
})
export class AuthModule {}
