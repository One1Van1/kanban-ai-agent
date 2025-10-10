export declare class ActivityDetailsDto {
    fromStatus?: string;
    toStatus?: string;
    fromColumn?: string;
    toColumn?: string;
}
export declare class UserActivityItemDto {
    id: string;
    type: string;
    taskId: string;
    taskTitle: string;
    description: string;
    timestamp: Date;
    details: ActivityDetailsDto;
}
export declare class UserActivityDataDto {
    userId: string;
    items: UserActivityItemDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class GetUserActivityResponseDto {
    success: boolean;
    data: UserActivityDataDto;
    message: string;
}
