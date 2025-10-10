import { UpdateTaskService } from './update-task.service';
import { UpdateTaskRequestDto } from './update-task.request.dto';
import { UpdateTaskResponseDto } from './update-task.response.dto';
export declare class UpdateTaskController {
    private readonly service;
    constructor(service: UpdateTaskService);
    handle(taskId: string, updateDto: UpdateTaskRequestDto): Promise<UpdateTaskResponseDto>;
}
