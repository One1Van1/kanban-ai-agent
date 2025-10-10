import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DeleteCommentRequestDto } from './delete-comment.request.dto';
import { DeleteCommentResponseDto } from './delete-comment.response.dto';
export declare class DeleteCommentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(commentId: string, requestDto: DeleteCommentRequestDto): Promise<DeleteCommentResponseDto>;
    private getCommentRecord;
    private validateDeletionPermissions;
    private extractCommentContent;
    private getRemainingCommentsCount;
    private createDeletionHistoryLog;
}
