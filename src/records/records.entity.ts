import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'records' })
@Tree('materialized-path')
export class RecordsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ nullable: false })
    isComment: boolean;

    @Column({ type: 'text', nullable: false })
    text: string;

    @TreeChildren()
    children: RecordsEntity[];

    @TreeParent()
    parent: RecordsEntity;

    @ManyToOne((type) => UsersEntity, (author: UsersEntity) => author.id, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    author: UsersEntity;
}
