import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../services/comments.service';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly recordsService: RecordsService, private readonly commentsService: CommentsService) {}

    @Post('/record/:recordId')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @CurrentUserDecorator() author: UsersEntity,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.createCommentOnRecord(createCommentDto, author, record, imageFiles);
    }

    @Get('/:commentId')
    public getCommentById(@Param('commentId') commentId: string) {
        return this.commentsService.getCommentById(commentId);
    }

    @Get('/record/:recordId')
    public async getCommentsTree(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getCommentsTree(record);
    }

    @Delete('/:commentId')
    public async removeComment(@Param('commentId') commentId: string) {
        const comment = await this.commentsService.getCommentById(commentId);

        return this.commentsService.removeComment(comment);
    }
}
