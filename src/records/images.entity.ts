import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'images' })
export class ImagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    // many images can be in one record
    @ManyToOne((type) => RecordsEntity, (record: RecordsEntity) => record.images, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    record: RecordsEntity;
}
