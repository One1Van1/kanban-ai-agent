import { TrackAgentInTaskService } from './track-agent-in-task.service';
import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { TrackAgentInTaskResponseDto } from './track-agent-in-task.response.dto';
export declare class TrackAgentInTaskController {
    private readonly trackAgentInTaskService;
    private readonly logger;
    constructor(trackAgentInTaskService: TrackAgentInTaskService);
    trackAgentInTask(agentId: string, requestDto: TrackAgentInTaskRequestDto): Promise<TrackAgentInTaskResponseDto>;
}
