import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleOptions } from 'ormconfig';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GuardsModule } from './guards/guards.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        UsersModule,
        AuthModule,
        GuardsModule,
    ],
})
export class AppModule {}
