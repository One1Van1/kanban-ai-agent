import { ExecuteAgentActionService } from './execute-agent-action.service';
import { ExecuteAgentActionRequestDto } from './execute-agent-action.request.dto';
import { ExecuteAgentActionResponseDto } from './execute-agent-action.response.dto';
export declare class ExecuteAgentActionController {
    private readonly service;
    constructor(service: ExecuteAgentActionService);
    handle(request: ExecuteAgentActionRequestDto): Promise<ExecuteAgentActionResponseDto>;
}
