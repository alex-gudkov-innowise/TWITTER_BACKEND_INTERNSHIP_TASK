import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRetweetDto } from './dto/create-retweet.dto';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { RecordsService } from './records.service';
import { RetweetsService } from './retweets.service';
import { TweetsService } from './tweets.service';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(
        private readonly recordsService: RecordsService,
        private readonly tweetsService: TweetsService,
        private readonly commentsService: CommentsService,
        private readonly retweetsService: RetweetsService,
        private readonly usersService: UsersService,
    ) {}

    @Get('/user/:userId/tweets')
    public async getUserTweets(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.tweetsService.getUserTweets(user);
    }

    @Get('/user/:userId/retweets')
    public async getUserRetweets(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.retweetsService.getUserRetweets(user);
    }

    @Post('/tweet')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public createTweet(
        @Body() createTweetDto: CreateTweetDto,
        @CurrentUserDecorator() author: UsersEntity,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.tweetsService.createTweet(createTweetDto, author, imageFiles);
    }

    @Post('/:recordId/retweet')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createRetweet(
        @Body() createRetweetDto: CreateRetweetDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.retweetsService.createRetweet(createRetweetDto, author, record, imageFiles);
    }

    @Post('/:recordId/comment')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.createComment(createCommentDto, author, record, imageFiles);
    }

    @Get('/tweet/:tweetId')
    public getTweetById(@Param('tweetId') tweetId: string) {
        return this.tweetsService.getTweetById(tweetId);
    }

    @Get('/comment/:commentId')
    public getCommentById(@Param('commentId') commentId: string) {
        return this.commentsService.getCommentById(commentId);
    }

    @Get('/retweet/:retweetId')
    public getRetweetById(@Param('retweetId') retweetId: string) {
        return this.retweetsService.getRetweetById(retweetId);
    }

    @Get('/:recordId/comments')
    public async getCommentsTree(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getCommentsTree(record);
    }

    @Delete('/tweet/:tweetId')
    public async removeTweet(@Param('tweetId') tweetId: string) {
        const tweet = await this.tweetsService.getTweetById(tweetId);

        return this.tweetsService.removeTweet(tweet);
    }

    @Delete('/comment/:commentId')
    public async removeComment(@Param('commentId') commentId: string) {
        const comment = await this.commentsService.getCommentById(commentId);

        return this.commentsService.removeComment(comment);
    }

    @Delete('/retweet/:retweetId')
    public async removeRetweet(@Param('retweetId') retweetId: string) {
        const retweet = await this.tweetsService.getTweetById(retweetId);

        return this.retweetsService.removeRetweet(retweet);
    }
}
