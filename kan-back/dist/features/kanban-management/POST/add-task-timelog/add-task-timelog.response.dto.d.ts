export declare class TimelogEntryDataDto {
    id: string;
    taskId: string;
    userId: string;
    description: string;
    timeSpentMinutes: number;
    timeSpentHours: number;
    startTime: Date;
    endTime: Date;
    notes?: string;
    createdAt: Date;
}
export declare class AddTaskTimelogResponseDto {
    success: boolean;
    data: TimelogEntryDataDto;
    message: string;
}
