import { GetAgentTaskHistoryService } from './get-agent-task-history.service';
import { GetAgentTaskHistoryQueryDto } from './get-agent-task-history.request.dto';
import { GetAgentTaskHistoryResponseDto } from './get-agent-task-history.response.dto';
export declare class GetAgentTaskHistoryController {
    private readonly service;
    constructor(service: GetAgentTaskHistoryService);
    handle(agentId: string, query: GetAgentTaskHistoryQueryDto): Promise<GetAgentTaskHistoryResponseDto>;
}
