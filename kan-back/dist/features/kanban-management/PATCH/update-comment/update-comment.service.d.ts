import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentResponseDto } from './update-comment.response.dto';
export declare class UpdateCommentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(commentId: string, requestDto: UpdateCommentRequestDto): Promise<UpdateCommentResponseDto>;
    private getCommentRecord;
    private validateUpdatePermissions;
    private extractCommentContent;
    private getCommentEditCount;
    private createUpdateHistoryLog;
}
