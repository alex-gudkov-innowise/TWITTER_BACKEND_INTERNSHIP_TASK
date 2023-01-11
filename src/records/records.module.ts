import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { RecordsController } from './records.controller';
import { RecordsEntity } from './records.entity';
import { RecordsService } from './records.service';

@Module({
    controllers: [RecordsController],
    providers: [RecordsService],
    imports: [TypeOrmModule.forFeature([RecordsEntity, UsersEntity])],
})
export class RecordsModule {}
