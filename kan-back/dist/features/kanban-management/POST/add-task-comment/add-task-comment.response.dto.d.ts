import { TaskHistory } from '../../../../entities/task-history.entity';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
export declare class CommentDto {
    id: string;
    taskId: string;
    text: string;
    author: string;
    authorEmail: string;
    createdAt: Date;
    type: string;
    action: string;
    constructor(taskHistory: TaskHistory, commentDto: AddTaskCommentRequestDto);
}
export declare class AddTaskCommentResponseDto {
    comment: CommentDto;
    success: boolean;
    message: string;
    taskId: string;
    context: Record<string, any>;
    constructor(taskHistory: TaskHistory, commentDto: AddTaskCommentRequestDto);
}
