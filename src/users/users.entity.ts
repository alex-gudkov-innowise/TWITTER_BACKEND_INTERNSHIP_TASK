import { RefreshTokensEntity } from 'src/auth/refresh-tokens.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    // one user account can have many active sessions
    @OneToMany(() => RefreshTokensEntity, (refreshToken) => refreshToken.value)
    refreshTokens: RefreshTokensEntity[];
}
