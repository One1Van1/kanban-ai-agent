import { DeleteTaskLinkService } from './delete-task-link.service';
import { DeleteTaskLinkRequestDto } from './delete-task-link.request.dto';
import { DeleteTaskLinkResponseDto } from './delete-task-link.response.dto';
export declare class DeleteTaskLinkController {
    private readonly service;
    constructor(service: DeleteTaskLinkService);
    handle(taskId: string, linkId: string, requestDto: DeleteTaskLinkRequestDto): Promise<DeleteTaskLinkResponseDto>;
}
