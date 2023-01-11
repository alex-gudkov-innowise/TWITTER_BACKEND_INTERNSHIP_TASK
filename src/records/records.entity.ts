import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'records' })
export class RecordsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    updatedAt: string;

    @Column({ nullable: false })
    isComment: boolean;

    @Column({ type: 'text', nullable: false })
    text: string;

    @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.id, {
        onDelete: 'SET NULL',
    })
    author: UsersEntity;

    @ManyToOne(() => UsersEntity, (parentRecordAuthor: UsersEntity) => parentRecordAuthor.id, {
        onDelete: 'SET NULL',
    })
    parentRecordAuthor: UsersEntity;

    @ManyToOne(() => RecordsEntity, (twitterRecord: RecordsEntity) => twitterRecord.id, {
        onDelete: 'SET NULL',
    })
    parentRecord: RecordsEntity;
}
