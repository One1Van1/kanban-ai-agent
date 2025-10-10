import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheContextRequestDto } from './cache-context.request.dto';
import { CacheContextResponseDto } from './cache-context.response.dto';
export declare class CacheContextService {
    private cacheManager;
    private configService;
    constructor(cacheManager: Cache, configService: ConfigService);
    execute(dto: CacheContextRequestDto): Promise<CacheContextResponseDto>;
}
