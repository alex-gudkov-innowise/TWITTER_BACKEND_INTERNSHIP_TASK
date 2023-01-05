import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleOptions } from 'ormconfig';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [UsersModule, AuthModule, TypeOrmModule.forRoot(typeOrmModuleOptions), AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
