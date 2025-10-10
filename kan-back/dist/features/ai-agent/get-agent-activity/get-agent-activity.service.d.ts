import { GetAgentActivityRequestDto } from './get-agent-activity.request.dto';
import { GetAgentActivityResponseDto } from './get-agent-activity.response.dto';
import { AgentActivity } from '../../../types/ai-agent.interface';
export declare class GetAgentActivityService {
    private readonly logger;
    private readonly mockActivities;
    constructor();
    execute(request: GetAgentActivityRequestDto): Promise<GetAgentActivityResponseDto>;
    private validateRequest;
    private applyFilters;
    private calculateSummary;
    private isValidDateString;
    private initializeMockData;
    addActivity(activity: AgentActivity): Promise<void>;
}
