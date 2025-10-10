export declare class TaskCommentDto {
    id: string;
    taskId: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TaskCommentsDataDto {
    items: TaskCommentDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class GetTaskCommentsResponseDto {
    success: boolean;
    data: TaskCommentsDataDto;
    message: string;
}
