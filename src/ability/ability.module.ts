import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityFactory } from './ability.factory';
import { RestrictionsEntity } from './restrictions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RestrictionsEntity])],
    providers: [AbilityFactory],
    exports: [AbilityFactory],
})
export class AbilityModule {}
