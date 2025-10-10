export declare class UpdateCommentResponseDto {
    commentId: string;
    taskId: string;
    content: string;
    originalContent: string;
    originalAuthor: string;
    updatedBy?: string;
    originalCreatedAt: Date;
    updatedAt: Date;
    updateReason?: string;
    isEdited: boolean;
    editCount: number;
    contentLength: number;
    success: boolean;
    historyLogId: string;
}
