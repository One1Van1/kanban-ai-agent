import { GetTaskTimelogService } from './get-task-timelog.service';
import { GetTaskTimelogRequestDto } from './get-task-timelog.request.dto';
import { GetTaskTimelogResponseDto } from './get-task-timelog.response.dto';
export declare class GetTaskTimelogController {
    private readonly service;
    constructor(service: GetTaskTimelogService);
    handle(taskId: string, query: GetTaskTimelogRequestDto): Promise<GetTaskTimelogResponseDto>;
}
