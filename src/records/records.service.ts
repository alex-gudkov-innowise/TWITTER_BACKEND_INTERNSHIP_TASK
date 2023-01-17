import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/users.entity';

import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsEntity } from './records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getUserTweets(user: UsersEntity) {
        if (!user) {
            throw new NotFoundException({ message: 'user not found' });
        }

        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
                author: user,
            },
        });
    }

    public getRecordById(recordId: number): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOneBy({ id: recordId });
    }

    public async createTweet(
        dto: CreateRecordDto,
        author: UsersEntity,
        imageFile: Express.Multer.File,
    ): Promise<RecordsEntity> {
        const tweet = this.recordsTreeRepository.create({
            text: dto.text,
            isComment: false,
            author,
        });

        const fileInfo = await this.filesService.createImageFile(imageFile);

        return this.recordsTreeRepository.save(tweet);
    }

    public createComment(dto: CreateRecordDto, author: UsersEntity, record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        const comment = this.recordsTreeRepository.create({
            text: dto.text,
            isComment: true,
            author,
            parent: record,
        });

        return this.recordsTreeRepository.save(comment);
    }

    public getRecordComments(record: RecordsEntity): Promise<RecordsEntity | null> {
        if (!record) {
            throw new NotFoundException({ message: 'record not found' });
        }

        return this.recordsTreeRepository.findDescendantsTree(record);
    }
}
