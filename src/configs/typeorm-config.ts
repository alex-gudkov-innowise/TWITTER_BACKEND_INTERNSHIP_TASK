import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'twitter',
    entities: ['./dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['./dist/migrations/*.js'],
    migrationsTableName: 'migrations',
};

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        return dataSourceOptions;
    }
}

export const dataSource = new DataSource(dataSourceOptions);