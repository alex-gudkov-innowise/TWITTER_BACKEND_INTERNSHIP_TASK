import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
    public async getUserTweets(@Param('userId') userId: number) {
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

    @Get('/:recordId')
    public getRecord(@Param('recordId') recordId: number) {
        return this.recordsService.getRecordById(recordId);
    }

    @Get('/:recordId/comments')
    public async getRecordComments(@Param('recordId') recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.getRecordComments(record);
    }

    @Post('/:recordId/comment')
    public async createComment(
        @Body() dto: CreateRecordDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: number,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.createComment(dto, author, record);
    }
}
