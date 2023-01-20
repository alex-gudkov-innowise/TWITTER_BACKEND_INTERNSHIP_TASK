import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    value: string;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.id, {
        onDelete: 'CASCADE',
    })
    user: UsersEntity;
}
