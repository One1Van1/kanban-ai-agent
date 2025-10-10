import { CommentDeleteMode } from './delete-comment.request.dto';
export declare class DeleteCommentResponseDto {
    commentId: string;
    taskId: string;
    content: string;
    deleteMode: CommentDeleteMode;
    originalAuthor: string;
    deletedBy?: string;
    originalCreatedAt: Date;
    deletedAt: Date;
    deleteReason?: string;
    canBeRestored: boolean;
    remainingCommentsCount: number;
    success: boolean;
    historyLogId: string;
}
