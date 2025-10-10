import { GetAgentActivityService } from './get-agent-activity.service';
import { GetAgentActivityRequestDto } from './get-agent-activity.request.dto';
import { GetAgentActivityResponseDto } from './get-agent-activity.response.dto';
export declare class GetAgentActivityController {
    private readonly service;
    constructor(service: GetAgentActivityService);
    handle(agentId: string, query: Omit<GetAgentActivityRequestDto, 'agentId'>): Promise<GetAgentActivityResponseDto>;
}
