import { CreateTaskService } from './create-task.service';
import { CreateTaskRequestDto } from './create-task.request.dto';
import { CreateTaskResponseDto } from './create-task.response.dto';
export declare class CreateTaskController {
    private readonly service;
    constructor(service: CreateTaskService);
    handle(createDto: CreateTaskRequestDto): Promise<CreateTaskResponseDto>;
}
