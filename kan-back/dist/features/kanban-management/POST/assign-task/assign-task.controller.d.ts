import { AssignTaskService } from './assign-task.service';
import { AssignTaskRequestDto } from './assign-task.request.dto';
import { AssignTaskResponseDto } from './assign-task.response.dto';
export declare class AssignTaskController {
    private readonly service;
    constructor(service: AssignTaskService);
    handle(taskId: string, assignDto: AssignTaskRequestDto): Promise<AssignTaskResponseDto>;
}
