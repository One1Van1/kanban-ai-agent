import { GetTaskService } from './get-task.service';
import { GetTaskResponseDto } from './get-task.response.dto';
export declare class GetTaskController {
    private readonly service;
    constructor(service: GetTaskService);
    handle(taskKey: string): Promise<GetTaskResponseDto>;
}
