import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { StoreAgentConfigRequestDto } from './store-agent-config.request.dto';
import { StoreAgentConfigResponseDto } from './store-agent-config.response.dto';
export declare class StoreAgentConfigService {
    private readonly agentRepository;
    private readonly instructionRepository;
    constructor(agentRepository: Repository<Agent>, instructionRepository: Repository<AgentInstruction>);
    execute(dto: StoreAgentConfigRequestDto): Promise<StoreAgentConfigResponseDto>;
    private createNewAgent;
    private updateExistingAgent;
}
