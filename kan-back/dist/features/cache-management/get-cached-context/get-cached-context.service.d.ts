import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';
export declare class GetCachedContextService {
    private cacheManager;
    private configService;
    constructor(cacheManager: Cache, configService: ConfigService);
    execute(key: string): Promise<GetCachedContextResponseDto>;
}
