import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleOptions } from 'ormconfig';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
    imports: [UsersModule, TypeOrmModule.forRoot(typeOrmModuleOptions)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
