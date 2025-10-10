import { UpdateTaskLabelsService } from './update-task-labels.service';
import { UpdateTaskLabelsRequestDto } from './update-task-labels.request.dto';
import { UpdateTaskLabelsResponseDto } from './update-task-labels.response.dto';
export declare class UpdateTaskLabelsController {
    private readonly service;
    constructor(service: UpdateTaskLabelsService);
    handle(taskId: string, requestDto: UpdateTaskLabelsRequestDto): Promise<UpdateTaskLabelsResponseDto>;
}
