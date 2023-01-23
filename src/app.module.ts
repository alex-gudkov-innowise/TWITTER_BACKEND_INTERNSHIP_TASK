import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerConfig } from 'mailer-config';
import { ServeStaticConfig } from 'serve-static-config';
import { TypeOrmConfig } from 'typeorm-config';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/controllers/auth.controller';
import { FilesModule } from './files/files.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RecordsModule } from './records/records.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
        MailerModule.forRootAsync({ useClass: MailerConfig }),
        JwtModule.register({}),
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        UsersModule,
        AuthModule,
        RecordsModule,
        FilesModule,
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController, UsersController, AuthController);
    }
}
