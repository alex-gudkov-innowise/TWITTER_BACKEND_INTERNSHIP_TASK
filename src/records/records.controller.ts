import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}

    @UseGuards(AuthGuard)
    @Post('/tweet')
    public CreateTweet(@Body() dto: CreateRecordDto, @CurrentUserDecorator() author: UsersEntity) {
        return this.recordsService.CreateTweet(dto, author);
    }
}
