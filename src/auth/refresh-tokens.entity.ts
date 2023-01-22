import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { UsersEntity } from 'src/users/users.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    value: string;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;

    @Column({ type: 'uuid', nullable: true })
    sessionId: string;
}
