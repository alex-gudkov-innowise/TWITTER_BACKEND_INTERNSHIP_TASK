import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecordsEntity } from 'src/records/entities/records.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

@Entity({ name: 'closed_records' })
export class ClosedRecordsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => RecordsEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'recordId' })
    record: RecordsEntity;

    @ManyToOne((type) => UsersEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'fromUserId' })
    fromUser: UsersEntity;

    @ManyToOne((type) => UsersEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'authorId' })
    author: UsersEntity;
}
