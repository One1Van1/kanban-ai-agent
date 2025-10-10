import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { AddCommentReactionRequestDto } from './add-comment-reaction.request.dto';
import { AddCommentReactionResponseDto } from './add-comment-reaction.response.dto';
export declare class AddCommentReactionService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(commentId: string, requestDto: AddCommentReactionRequestDto): Promise<AddCommentReactionResponseDto>;
    private getCommentRecord;
    private findExistingReaction;
    private createReactionHistoryLog;
    private getUserDisplayName;
    private countReactions;
    private getEmojiDisplay;
}
