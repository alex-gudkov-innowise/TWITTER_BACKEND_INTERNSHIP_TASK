import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from 'src/files/files.module';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';

import { RecordsController } from './records.controller';
import { RecordsEntity } from './records.entity';
import { RecordsService } from './records.service';

@Module({
    controllers: [RecordsController],
    providers: [RecordsService],
    imports: [TypeOrmModule.forFeature([RecordsEntity, UsersEntity]), UsersModule, RecordsModule, FilesModule],
})
export class RecordsModule {}
