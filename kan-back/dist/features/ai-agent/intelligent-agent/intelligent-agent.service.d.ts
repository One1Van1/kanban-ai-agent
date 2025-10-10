import { ConfigService } from '@nestjs/config';
import { ExecuteAgentActionRequestDto } from '../execute-agent-action/execute-agent-action.request.dto';
import { AgentActionOutputDto } from '../execute-agent-action/execute-agent-action.response.dto';
import { AgentInstruction } from '@/entities/agent-instruction.entity';
import { Agent } from '@/entities/agent.entity';
export declare class IntelligentAgentService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    executeIntelligentAction(instruction: AgentInstruction, agent: Agent, request: ExecuteAgentActionRequestDto): Promise<AgentActionOutputDto[]>;
    private analyzeBusinessContext;
    private analyzeKanbanWorkflow;
    private makeIntelligentDecision;
    private executeIntelligentActions;
    private executeSpecificAction;
    private learnFromExecution;
    private recordDecisionForLearning;
}
