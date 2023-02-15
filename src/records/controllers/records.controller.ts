import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';

import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}

    @Get('/:recordId')
    public getRecordId(@Param('recordId') recordId: string) {
        return this.recordsService.getRecordById(recordId);
    }
}
