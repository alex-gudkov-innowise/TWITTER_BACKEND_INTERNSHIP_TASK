import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'records' })
export class RecordsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ nullable: false })
    isComment: boolean;

    @Column({ type: 'text', nullable: false })
    text: string;

    @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.id, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    author: UsersEntity;

    @ManyToOne(() => RecordsEntity, (record: RecordsEntity) => record.id, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    parentRecord: RecordsEntity;
}
