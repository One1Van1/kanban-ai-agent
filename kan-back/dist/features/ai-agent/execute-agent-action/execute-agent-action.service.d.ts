import { Repository } from 'typeorm';
import { ExecuteAgentActionRequestDto } from './execute-agent-action.request.dto';
import { ExecuteAgentActionResponseDto } from './execute-agent-action.response.dto';
import { AgentActivity } from '../../../types/ai-agent.interface';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { InstructionExecutorService } from '../instruction-executor/instruction-executor.service';
export declare class ExecuteAgentActionService {
    private readonly agentRepository;
    private readonly agentInstructionRepository;
    private readonly instructionExecutorService;
    private readonly logger;
    private readonly agentActivities;
    constructor(agentRepository: Repository<Agent>, agentInstructionRepository: Repository<AgentInstruction>, instructionExecutorService: InstructionExecutorService);
    execute(request: ExecuteAgentActionRequestDto): Promise<ExecuteAgentActionResponseDto>;
    private validateRequest;
    private getAgentConfig;
    private getColumnInstructions;
    private shouldExecuteAgent;
    private performAgentActions;
    private createSkippedResponse;
    private generateSummary;
    getAgentActivity(executionId: string): Promise<AgentActivity | null>;
    getAgentActivitiesByAgent(agentId: string): Promise<AgentActivity[]>;
}
