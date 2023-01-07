import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleOptions } from 'ormconfig';

import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './guards/guards.module';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        MailerModule.forRoot({
            // create transporter object using the default SMTP transport
            transport: {
                host: process.env.MAILER_HOST,
                port: Number(process.env.MAILER_PORT),
                secure: Boolean(process.env.MAILER_IS_SECURE),
                auth: {
                    user: process.env.MAILER_USER,
                    pass: process.env.MAILER_PASS,
                },
            },
        }),
        UsersModule,
        AuthModule,
        GuardsModule,
    ],
})
export class AppModule {}
