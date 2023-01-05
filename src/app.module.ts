import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleOptions } from 'ormconfig';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [TypeOrmModule.forRootAsync(typeOrmModuleOptions)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
