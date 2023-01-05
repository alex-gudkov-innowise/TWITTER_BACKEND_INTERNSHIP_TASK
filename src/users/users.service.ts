import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

    public async getAllUsers() {
        const allUsers = await this.usersRepository.find();

        return allUsers;
    }

    public async getUserById(id: number): Promise<UsersEntity> {
        const user = await this.usersRepository.findOneBy({ id });

        return user;
    }

    public async getUserByEmail(email: string): Promise<UsersEntity> {
        const user = await this.usersRepository.findOneBy({ email });

        return user;
    }

    public async createUser(dto: CreateUserDto): Promise<UsersEntity> {
        // add new user to database
        const user = this.usersRepository.create(dto);

        await this.usersRepository.save(user);

        return user;
    }
}
