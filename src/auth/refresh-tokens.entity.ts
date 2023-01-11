import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    value: string;

    // refresh token refers only to one user
    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.id, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    user: UsersEntity;
}
