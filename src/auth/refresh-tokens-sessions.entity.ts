import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { RefreshTokensEntity } from './refresh-tokens.entity';

@Entity({ name: 'refresh_tokens_sessions' })
export class RefreshTokensSessionsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    sessionId: string;

    @OneToOne(() => RefreshTokensEntity)
    @JoinColumn({ name: 'refreshTokenId' })
    refreshToken: RefreshTokensEntity;
}
