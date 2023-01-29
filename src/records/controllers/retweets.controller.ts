import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserRolesDecorator } from 'src/decorators/current-user-roles.decorator';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateRetweetDto } from '../dto/create-retweet.dto';
import { RecordsService } from '../services/records.service';
import { RetweetsService } from '../services/retweets.service';
import { TweetsService } from '../services/tweets.service';

@UseGuards(AuthGuard)
@Controller('/retweets')
export class RetweetsController {
    constructor(
        private readonly recordsService: RecordsService,
        private readonly retweetsService: RetweetsService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post('/restriction/read/:userId')
    public async createRestrictionToReadRetweets(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.retweetsService.createRestrictionToReadRetweets(targetUser, initiatorUser);
    }

    @Post('/restriction/create/:userId')
    public async createRestrictionToCreateRetweets(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.retweetsService.createRestrictionToCreateRetweets(targetUser, initiatorUser);
    }

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
    public async deleteRetweetById(
        @Param('retweetId') retweetId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const retweet = await this.retweetsService.getRetweetByIdOrThrow(retweetId);
        const currentUserAbility = this.caslAbilityFactory.defineAbilityToDeleteRetweets(
            currentUser,
            currentUserRoles,
            retweet.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('delete', 'retweets');

        return this.retweetsService.deleteRetweet(retweet);
    }
}
