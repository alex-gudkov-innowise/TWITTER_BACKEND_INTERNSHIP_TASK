import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createCacheOptions(): CacheModuleOptions {
        return {
            ttl: Number(this.configService.get<number>('CACHE_TTL')),
        };
    }
}
