import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';

import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('feed')
export class FeedController {
    constructor(private readonly recordsService: RecordsService) {}

    @Get('/all')
    public getAllPosts() {
        return this.recordsService.getAllPosts();
    }
}
