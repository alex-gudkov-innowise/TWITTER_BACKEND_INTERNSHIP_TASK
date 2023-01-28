import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('TYPEORM_HOST'),
    port: configService.get<number>('TYPEORM_PORT'),
    username: configService.get<string>('TYPEORM_USERNAME'),
    password: configService.get<string>('TYPEORM_PASSWORD'),
    database: configService.get<string>('TYPEORM_DATABASE'),
    entities: ['./dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['./dist/migrations/*.js'],
    migrationsTableName: 'migrations',
};

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return dataSourceOptions;
    }
}

export const dataSource = new DataSource(dataSourceOptions);

// Use environment variables in typeorm-config.ts 