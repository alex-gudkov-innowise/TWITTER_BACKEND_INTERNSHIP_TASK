import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityFactory } from './ability.factory';
import { RestrictionsService } from './restriction.service';
import { RestrictionsController } from './restrictions.controller';
import { RestrictionsEntity } from './restrictions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RestrictionsEntity])],
    providers: [AbilityFactory, RestrictionsService],
    exports: [AbilityFactory],
    controllers: [RestrictionsController],
})
export class AbilityModule {}
