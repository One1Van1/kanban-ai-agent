import { Repository } from 'typeorm';
import { GetAgentTaskHistoryQueryDto } from './get-agent-task-history.request.dto';
import { GetAgentTaskHistoryResponseDto } from './get-agent-task-history.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class GetAgentTaskHistoryService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(agentId: string, query: GetAgentTaskHistoryQueryDto): Promise<GetAgentTaskHistoryResponseDto>;
}
