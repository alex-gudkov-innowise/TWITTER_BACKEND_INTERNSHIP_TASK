import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from 'src/files/files.module';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';

import { CommentsService } from './comments.service';
import { RecordImagesEntity } from './record-images.entity';
import { RecordsController } from './records.controller';
import { RecordsEntity } from './records.entity';
import { RecordsService } from './records.service';
import { RetweetsService } from './retweets.service';
import { TweetsService } from './tweets.service';

@Module({
    controllers: [RecordsController],
    providers: [RecordsService, TweetsService, RetweetsService, CommentsService],
    imports: [
        TypeOrmModule.forFeature([RecordsEntity, UsersEntity, RecordImagesEntity]),
        UsersModule,
        RecordsModule,
        FilesModule,
    ],
})
export class RecordsModule {}
