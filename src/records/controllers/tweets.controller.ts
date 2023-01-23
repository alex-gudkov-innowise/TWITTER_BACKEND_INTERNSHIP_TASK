import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateTweetDto } from '../dtos/create-tweet.dto';
import { TweetsService } from '../services/tweets.service';

@UseGuards(AuthGuard)
@Controller('tweets')
export class TweetsController {
    constructor(private readonly tweetsService: TweetsService, private readonly usersService: UsersService) {}

    @Get('/user/:userId/tweets')
    public async getAllUserTweets(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.tweetsService.getAllUserTweets(user);
    }

    @Post('/')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public createTweet(
        @Body() createTweetDto: CreateTweetDto,
        @CurrentUserDecorator() author: UsersEntity,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.tweetsService.createTweet(createTweetDto, author, imageFiles);
    }

    @Get('/:tweetId')
    public getTweetById(@Param('tweetId') tweetId: string) {
        return this.tweetsService.getTweetById(tweetId);
    }

    @Delete('/:tweetId')
    public async removeTweet(@Param('tweetId') tweetId: string) {
        const tweet = await this.tweetsService.getTweetById(tweetId);

        return this.tweetsService.removeTweet(tweet);
    }
}