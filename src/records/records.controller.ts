import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsService } from './records.service';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}

    @Post('/tweet')
    public async CreateTweet(@Body() dto: CreateRecordDto, @CurrentUserDecorator() author: UsersEntity) {
        return this.recordsService.CreateTweet(dto, author);
    }

    @Get('/tweet/:tweetId')
    public async GetTweet(@Param('tweetId') tweetId: number) {
        return this.recordsService.getTweetById(tweetId);
    }

    @Get('/tweet/:tweetId/comments')
    public async GetTweetComments(@Param('tweetId') tweetId: number) {
        const tweet = await this.recordsService.getTweetById(tweetId);

        return this.recordsService.getTweetComments(tweet);
    }

    @Post('/tweet/:tweetId/comment')
    public async CreateComment(
        @Body() dto: CreateRecordDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('tweetId') tweetId: number,
    ) {
        const tweet = await this.recordsService.getTweetById(tweetId);

        return this.recordsService.CreateComment(dto, author, tweet);
    }
}
