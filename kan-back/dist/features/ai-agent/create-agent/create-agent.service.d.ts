import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
import { Agent } from '@/entities/agent.entity';
export declare class CreateAgentService {
    private readonly configService;
    private readonly agentRepository;
    private readonly logger;
    constructor(configService: ConfigService, agentRepository: Repository<Agent>);
    execute(requestDto: CreateAgentRequestDto): Promise<CreateAgentResponseDto>;
    findById(agentId: string): Promise<Agent | null>;
    findAll(): Promise<Agent[]>;
}
