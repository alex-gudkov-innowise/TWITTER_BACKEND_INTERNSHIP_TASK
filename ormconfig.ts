import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'twitter_db_1',
    entities: ['./dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['./dist/migrations/*.js'],
    migrationsTableName: 'migrations',
};
