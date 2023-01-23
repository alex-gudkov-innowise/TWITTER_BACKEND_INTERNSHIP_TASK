import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

    public getAllUsers(): Promise<UsersEntity[]> {
        return this.usersRepository.find();
    }

    public getUserById(id: string): Promise<UsersEntity | null> {
        return this.usersRepository.findOneBy({ id });
    }

    public getUserByEmail(email: string): Promise<UsersEntity | null> {
        return this.usersRepository.findOneBy({ email });
    }

    public createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
        const user = this.usersRepository.create(createUserDto);

        return this.usersRepository.save(user);
    }
}
