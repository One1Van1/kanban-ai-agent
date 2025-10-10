import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
export declare class AddTaskCommentController {
    private readonly addTaskCommentService;
    constructor(addTaskCommentService: AddTaskCommentService);
    handle(taskKey: string, requestDto: AddTaskCommentRequestDto): Promise<AddTaskCommentResponseDto>;
}
