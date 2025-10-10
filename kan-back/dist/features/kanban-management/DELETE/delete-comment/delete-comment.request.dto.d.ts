export declare enum CommentDeleteMode {
    SOFT_DELETE = "SOFT_DELETE",
    HARD_DELETE = "HARD_DELETE"
}
export declare class DeleteCommentRequestDto {
    deleteMode?: CommentDeleteMode;
    deletedBy?: string;
    deleteReason?: string;
}
