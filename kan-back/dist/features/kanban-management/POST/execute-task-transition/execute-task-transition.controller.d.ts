import { ExecuteTaskTransitionService } from './execute-task-transition.service';
import { ExecuteTaskTransitionRequestDto } from './execute-task-transition.request.dto';
import { ExecuteTaskTransitionResponseDto } from './execute-task-transition.response.dto';
export declare class ExecuteTaskTransitionController {
    private readonly service;
    constructor(service: ExecuteTaskTransitionService);
    executeTransition(taskId: string, requestDto: ExecuteTaskTransitionRequestDto): Promise<ExecuteTaskTransitionResponseDto>;
}
