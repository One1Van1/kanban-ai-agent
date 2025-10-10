import { StoreAgentConfigService } from './store-agent-config.service';
import { StoreAgentConfigRequestDto } from './store-agent-config.request.dto';
import { StoreAgentConfigResponseDto } from './store-agent-config.response.dto';
export declare class StoreAgentConfigController {
    private readonly service;
    constructor(service: StoreAgentConfigService);
    handle(requestDto: StoreAgentConfigRequestDto): Promise<StoreAgentConfigResponseDto>;
}
