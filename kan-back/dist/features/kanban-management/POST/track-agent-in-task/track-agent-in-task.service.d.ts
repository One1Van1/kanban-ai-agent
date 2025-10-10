import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { TrackAgentInTaskResponseDto } from './track-agent-in-task.response.dto';
import { CreateAgentService } from '../../../ai-agent/create-agent/create-agent.service';
interface TaskTracking {
    agentId: string;
    taskId: string;
    boardId: string;
    columnId: string;
    columnName?: string;
    isActive: boolean;
    startedAt: Date;
    triggerType?: string;
    taskData?: any;
}
export declare class TrackAgentInTaskService {
    private readonly createAgentService;
    private readonly logger;
    private readonly taskTrackings;
    constructor(createAgentService: CreateAgentService);
    execute(agentId: string, requestDto: TrackAgentInTaskRequestDto): Promise<TrackAgentInTaskResponseDto>;
    private determineNextActions;
    getTrackingsByAgent(agentId: string): Promise<TaskTracking[]>;
    stopTracking(agentId: string, taskId: string): Promise<boolean>;
}
export {};
