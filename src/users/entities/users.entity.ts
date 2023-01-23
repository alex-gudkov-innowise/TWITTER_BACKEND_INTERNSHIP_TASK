import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { RefreshTokensEntity } from 'src/auth/entities/refresh-tokens.entity';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => RefreshTokensEntity, (refreshToken: RefreshTokensEntity) => refreshToken.user)
    refreshTokens: RefreshTokensEntity[];
}
