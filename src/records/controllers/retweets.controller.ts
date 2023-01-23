import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateRetweetDto } from '../dtos/create-retweet.dto';
import { RecordsService } from '../services/records.service';
import { RetweetsService } from '../services/retweets.service';
import { TweetsService } from '../services/tweets.service';

@UseGuards(AuthGuard)
@Controller('/retweets')
export class RetweetsController {
    constructor(
        private readonly recordsService: RecordsService,
        private readonly tweetsService: TweetsService,
        private readonly retweetsService: RetweetsService,
        private readonly usersService: UsersService,
    ) {}

    @Get('/user/:userId')
    public async getUserRetweets(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.retweetsService.getUserRetweets(user);
    }

    @Post('/:recordId')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createRetweetOnRecord(
        @Body() createRetweetDto: CreateRetweetDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.retweetsService.createRetweetOnRecord(createRetweetDto, author, record, imageFiles);
    }

    @Get('/:retweetId')
    public getRetweetById(@Param('retweetId') retweetId: string) {
        return this.retweetsService.getRetweetById(retweetId);
    }

    @Delete('/:retweetId')
    public async removeRetweet(@Param('retweetId') retweetId: string) {
        const retweet = await this.tweetsService.getTweetById(retweetId);

        return this.retweetsService.removeRetweet(retweet);
    }
}