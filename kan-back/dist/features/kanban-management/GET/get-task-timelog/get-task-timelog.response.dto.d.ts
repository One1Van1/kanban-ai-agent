export declare class TimelogEntryDto {
    id: string;
    taskId: string;
    userId: string;
    description: string;
    timeSpentMinutes: number;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
}
export declare class TimelogSummaryDto {
    totalTimeSpentMinutes: number;
    totalTimeSpentHours: number;
    averageTimePerEntry: number;
    totalEntries: number;
    uniqueUsers: number;
}
export declare class TaskTimelogDataDto {
    taskId: string;
    items: TimelogEntryDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: TimelogSummaryDto;
}
export declare class GetTaskTimelogResponseDto {
    success: boolean;
    data: TaskTimelogDataDto;
    message: string;
}
