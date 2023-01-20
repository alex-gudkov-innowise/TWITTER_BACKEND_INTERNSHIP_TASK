import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

import { RefreshTokensEntity } from './refresh-tokens.entity';

@Entity({ name: 'users_sessions' })
export class UsersSessionsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    sessionId: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;

    @OneToOne(() => RefreshTokensEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'refreshTokenId' })
    refreshToken: RefreshTokensEntity;
}
