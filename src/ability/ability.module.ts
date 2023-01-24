import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityFactory } from './ability.factory';
import { ClosedRecordsEntity } from './closed-records.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClosedRecordsEntity])],
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class AbilityModule {}
