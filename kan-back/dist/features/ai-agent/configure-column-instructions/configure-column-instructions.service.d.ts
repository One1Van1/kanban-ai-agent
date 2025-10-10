import { Repository } from 'typeorm';
import { ConfigureColumnInstructionsRequestDto } from './configure-column-instructions.request.dto';
import { ConfigureColumnInstructionsResponseDto } from './configure-column-instructions.response.dto';
import { AgentColumnInstruction } from '../../../types/ai-agent.interface';
import { AgentInstruction } from '@/entities/agent-instruction.entity';
export declare class ConfigureColumnInstructionsService {
    private readonly agentInstructionRepository;
    private readonly logger;
    constructor(agentInstructionRepository: Repository<AgentInstruction>);
    execute(request: ConfigureColumnInstructionsRequestDto): Promise<ConfigureColumnInstructionsResponseDto>;
    private validateAgent;
    private validateColumnData;
    getColumnInstructionsByAgent(agentId: string): Promise<AgentColumnInstruction[]>;
    getColumnInstruction(agentId: string, boardId: string, columnId: string): Promise<AgentColumnInstruction | null>;
}
