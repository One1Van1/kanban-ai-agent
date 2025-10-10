import { GetTaskCommentsService } from './get-task-comments.service';
import { GetTaskCommentsRequestDto } from './get-task-comments.request.dto';
import { GetTaskCommentsResponseDto } from './get-task-comments.response.dto';
export declare class GetTaskCommentsController {
    private readonly service;
    constructor(service: GetTaskCommentsService);
    handle(taskId: string, query: GetTaskCommentsRequestDto): Promise<GetTaskCommentsResponseDto>;
}
