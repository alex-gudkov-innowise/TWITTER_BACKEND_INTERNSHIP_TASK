import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('TYPEORM_HOST'),
            username: this.configService.get<string>('TYPEORM_USERNAME'),
            password: this.configService.get<string>('TYPEORM_PASSWORD'),
            database: this.configService.get<string>('TYPEORM_DATABASE'),
            port: Number(this.configService.get<number>('TYPEORM_PORT')),
            synchronize: false,
            entities: ['./dist/**/*.entity.js'],
            migrations: ['./dist/migrations/*.js'],
            migrationsTableName: 'migrations',
        };
    }
}
