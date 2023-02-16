import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserEntityWithJwtPair } from 'src/interfaces/user-entity-with-jwt-pair.interface';

import { CreateUserDto } from '../dto/create-user.dto';
import { UserProfileImagesEntity } from '../entities/users-profile-images.entity';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(UserProfileImagesEntity)
        private readonly userProfileImagesRepository: Repository<UserProfileImagesEntity>,
    ) {}

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
        const userProfileImages = this.userProfileImagesRepository.create({
            user,
            avatarImageName: null,
            coverImageName: null,
        });

        this.userProfileImagesRepository.save(userProfileImages);

        return this.usersRepository.save(user);
    }

    public getUserProfileImages(user: UsersEntity): Promise<UserProfileImagesEntity> {
        return this.userProfileImagesRepository.findOneBy({ user });
    }

    public deleteUser(user: UsersEntity): Promise<DeleteResult> {
        return this.usersRepository.delete(user);
    }
}
