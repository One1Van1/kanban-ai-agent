import { MoveTaskToColumnService } from './move-task-to-column.service';
import { MoveTaskRequestDto } from './move-task-request.dto';
import { MoveTaskResponseDto } from './move-task-response.dto';
export declare class MoveTaskToColumnController {
    private readonly service;
    constructor(service: MoveTaskToColumnService);
    handle(taskId: string, moveDto: MoveTaskRequestDto): Promise<MoveTaskResponseDto>;
}
