import { Repository } from 'typeorm';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class AddTaskCommentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, commentDto: AddTaskCommentRequestDto): Promise<AddTaskCommentResponseDto>;
}
