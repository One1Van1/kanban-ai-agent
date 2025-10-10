import { MoveTaskService } from './move-task.service';
import { MoveTaskRequestDto } from './move-task.request.dto';
import { MoveTaskResponseDto } from './move-task.response.dto';
export declare class MoveTaskController {
    private readonly service;
    constructor(service: MoveTaskService);
    handle(taskKey: string, requestDto: MoveTaskRequestDto): Promise<MoveTaskResponseDto>;
}
