import { CreateTaskLinkService } from './create-task-link.service';
import { CreateTaskLinkRequestDto } from './create-task-link.request.dto';
import { CreateTaskLinkResponseDto } from './create-task-link.response.dto';
export declare class CreateTaskLinkController {
    private readonly service;
    constructor(service: CreateTaskLinkService);
    handle(taskId: string, requestDto: CreateTaskLinkRequestDto): Promise<CreateTaskLinkResponseDto>;
}
