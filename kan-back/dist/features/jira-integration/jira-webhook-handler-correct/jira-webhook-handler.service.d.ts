import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Agent } from '@/entities/agent.entity';
import { AgentInstruction } from '@/entities/agent-instruction.entity';
export declare class JiraWebhookHandlerService extends JiraBaseService {
    private readonly agentRepository;
    private readonly agentInstructionRepository;
    constructor(configService: ConfigService, agentRepository: Repository<Agent>, agentInstructionRepository: Repository<AgentInstruction>);
    execute(requestDto: JiraWebhookHandlerRequestDto): Promise<JiraWebhookHandlerResponseDto>;
    private extractEventType;
    private handleIssueCreated;
    private handleIssueUpdated;
    private handleIssueDeleted;
    private activateAgentsForTask;
    private activateAgent;
}
