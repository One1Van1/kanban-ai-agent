import { ConfigureAgentService } from './configure-agent.service';
import { ConfigureAgentRequestDto } from './configure-agent.request.dto';
import { ConfigureAgentResponseDto } from './configure-agent.response.dto';
export declare class ConfigureAgentController {
    private readonly configureAgentService;
    private readonly logger;
    constructor(configureAgentService: ConfigureAgentService);
    handle(agentId: string, requestDto: ConfigureAgentRequestDto): Promise<ConfigureAgentResponseDto>;
}
