import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserRolesDecorator } from 'src/decorators/current-user-roles.decorator';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateTweetDto } from '../dto/create-tweet.dto';
import { TweetsService } from '../services/tweets.service';

@UseGuards(AuthGuard)
@Controller('tweets')
export class TweetsController {
    constructor(
        private readonly tweetsService: TweetsService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post('/restriction/read/:userId')
    public async createReadingTweetsRestriction(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.tweetsService.createReadingTweetsRestriction(targetUser, initiatorUser);
    }

    @Get('/user/:userId')
    public async getAllUserTweets(
        @Param('userId') userId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const user = await this.usersService.getUserById(userId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadTweets(
            currentUser,
            currentUserRoles,
            user,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'tweets');

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
