import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions, ServeStaticModuleOptionsFactory } from '@nestjs/serve-static';
import * as path from 'path';

@Injectable()
export class ServeStaticConfig implements ServeStaticModuleOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createLoggerOptions(): Promise<ServeStaticModuleOptions[]> | ServeStaticModuleOptions[] {
        return [
            {
                rootPath: path.join(__dirname, '..', 'static'),
            },
        ];
    }
}
