import { CacheAgentConfigsService } from './cache-agent-configs.service';
import { CacheAgentConfigsRequestDto } from './cache-agent-configs.request.dto';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';
export declare class CacheAgentConfigsController {
    private readonly service;
    constructor(service: CacheAgentConfigsService);
    handle(request: CacheAgentConfigsRequestDto): Promise<CacheAgentConfigsResponseDto>;
}
