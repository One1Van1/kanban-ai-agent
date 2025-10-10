import { AddTaskTimelogService } from './add-task-timelog.service';
import { AddTaskTimelogRequestDto } from './add-task-timelog.request.dto';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';
export declare class AddTaskTimelogController {
    private readonly service;
    constructor(service: AddTaskTimelogService);
    handle(taskId: string, requestDto: AddTaskTimelogRequestDto): Promise<AddTaskTimelogResponseDto>;
}
