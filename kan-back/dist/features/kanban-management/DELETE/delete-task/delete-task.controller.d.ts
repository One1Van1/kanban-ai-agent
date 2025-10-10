import { DeleteTaskService } from './delete-task.service';
import { DeleteTaskRequestDto } from './delete-task.request.dto';
import { DeleteTaskResponseDto } from './delete-task.response.dto';
export declare class DeleteTaskController {
    private readonly service;
    constructor(service: DeleteTaskService);
    deleteTask(taskId: string, requestDto: DeleteTaskRequestDto): Promise<DeleteTaskResponseDto>;
}
