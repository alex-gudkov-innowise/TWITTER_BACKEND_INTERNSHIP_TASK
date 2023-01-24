import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class RestrictionsService {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public getAllUserRestrictions(user: UsersEntity): Promise<RestrictionsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.restrictionsRepository.find({
            where: {
                initiatorUser: user,
            },
            relations: {
                targetUser: true,
            },
        });
    }
}
