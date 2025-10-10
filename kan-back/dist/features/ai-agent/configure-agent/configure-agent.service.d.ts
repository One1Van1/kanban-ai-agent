import { ConfigService } from '@nestjs/config';
import { ConfigureAgentRequestDto } from './configure-agent.request.dto';
import { ConfigureAgentResponseDto } from './configure-agent.response.dto';
import { CreateAgentService } from '../create-agent/create-agent.service';
export declare class ConfigureAgentService {
    private readonly configService;
    private readonly createAgentService;
    private readonly logger;
    constructor(configService: ConfigService, createAgentService: CreateAgentService);
    execute(agentId: string, requestDto: ConfigureAgentRequestDto): Promise<ConfigureAgentResponseDto>;
}
