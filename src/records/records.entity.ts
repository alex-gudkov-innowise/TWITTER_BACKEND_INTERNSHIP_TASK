import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { ImagesEntity } from './images.entity';

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

    // many records can belong to user
    @ManyToOne((type) => UsersEntity, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    author: UsersEntity;

    // one record can contain many images
    @OneToMany((type) => ImagesEntity, (image: ImagesEntity) => image.record, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    images: ImagesEntity[];
}
