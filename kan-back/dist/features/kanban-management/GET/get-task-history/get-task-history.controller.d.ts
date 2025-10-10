import { GetTaskHistoryService } from './get-task-history.service';
import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';
export declare class GetTaskHistoryController {
    private readonly service;
    constructor(service: GetTaskHistoryService);
    handle(taskId: string): Promise<GetTaskHistoryResponseDto>;
}
