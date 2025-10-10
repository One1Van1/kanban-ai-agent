import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheAgentConfigsRequestDto } from './cache-agent-configs.request.dto';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';
export declare class CacheAgentConfigsService {
    private cacheManager;
    private configService;
    constructor(cacheManager: Cache, configService: ConfigService);
    execute(dto: CacheAgentConfigsRequestDto): Promise<CacheAgentConfigsResponseDto>;
}
