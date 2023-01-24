import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfig } from 'jwt-config';
import { MailerConfig } from 'mailer-config';
import { ServeStaticConfig } from 'serve-static-config';
import { TypeOrmConfig } from 'typeorm-config';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/controllers/auth.controller';
import { FilesModule } from './files/files.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CommentsController } from './records/controllers/comments.controller';
import { RetweetsController } from './records/controllers/retweets.controller';
import { TweetsController } from './records/controllers/tweets.controller';
import { RecordsModule } from './records/records.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';
import { AbilityModule } from './ability/ability.module';

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
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        JwtModule.registerAsync({ useClass: JwtConfig }),
        UsersModule,
        AuthModule,
        RecordsModule,
        FilesModule,
        AbilityModule,
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(UsersController, AuthController, TweetsController, CommentsController, RetweetsController);
    }
}
