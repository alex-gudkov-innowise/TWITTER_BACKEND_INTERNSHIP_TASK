import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsService } from './records.service';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService, private readonly usersService: UsersService) {}

    @Get('/user/:userId')
    public async getUserTweets(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.recordsService.getUserTweets(user);
    }

    @Post('/tweet')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public createTweet(
        @Body() dto: CreateRecordDto,
        @CurrentUserDecorator() author: UsersEntity,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.recordsService.createTweet(dto, author, imageFiles);
    }

    @Post('/:recordId/retweet')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createRetweet(
        @Body() dto: CreateRecordDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.createRetweet(dto, author, record, imageFiles);
    }

    @Post('/:recordId/comment')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createComment(
        @Body() dto: CreateRecordDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.createComment(dto, author, record, imageFiles);
    }

    @Get('/tweet/:tweetId')
    public getTweetById(@Param('tweetId') tweetId: string) {
        return this.recordsService.getTweetById(tweetId);
    }

    @Get('/comment/:commentId')
    public getCommentById(@Param('commentId') commentId: string) {
        return this.recordsService.getCommentById(commentId);
    }

    @Get('/retweet/:retweetId')
    public getRetweetById(@Param('retweetId') retweetId: string) {
        return this.recordsService.getRetweetById(retweetId);
    }

    @Get('/:recordId/comments')
    public async getCommentsTree(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.getCommentsTree(record);
    }

    @Delete('/tweet/:tweetId')
    public async removeTweet(@Param('tweetId') tweetId: string) {
        const tweet = await this.recordsService.getTweetById(tweetId);

        return this.recordsService.removeTweet(tweet);
    }

    @Delete('/comment/:commentId')
    public async removeComment(@Param('commentId') commentId: string) {
        const comment = await this.recordsService.getCommentById(commentId);

        return this.recordsService.removeComment(comment);
    }

    @Delete('/retweet/:retweetId')
    public async removeRetweet(@Param('retweetId') retweetId: string) {
        const retweet = await this.recordsService.getTweetById(retweetId);

        return this.recordsService.removeRetweet(retweet);
    }
}
