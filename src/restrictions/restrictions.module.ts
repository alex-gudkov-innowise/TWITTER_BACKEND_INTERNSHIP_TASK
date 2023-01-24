import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityFactory } from './ability.factory';
import { RestrictionsController } from './restrictions.controller';
import { RestrictionsEntity } from './restrictions.entity';
import { RestrictionsService } from './restrictions.service';

@Module({
    imports: [TypeOrmModule.forFeature([RestrictionsEntity])],
    providers: [AbilityFactory, RestrictionsService],
    exports: [AbilityFactory],
    controllers: [RestrictionsController],
})
export class RestrictionsModule {}
