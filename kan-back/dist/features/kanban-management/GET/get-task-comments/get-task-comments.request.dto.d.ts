export declare enum CommentSortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class GetTaskCommentsRequestDto {
    page?: number;
    limit?: number;
    sortOrder?: CommentSortOrder;
}
