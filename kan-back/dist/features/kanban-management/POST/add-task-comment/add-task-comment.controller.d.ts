import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
export declare class AddTaskCommentController {
    private readonly service;
    constructor(service: AddTaskCommentService);
    handle(taskId: string, commentDto: AddTaskCommentRequestDto): Promise<AddTaskCommentResponseDto>;
}
