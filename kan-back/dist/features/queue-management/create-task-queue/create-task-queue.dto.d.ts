export declare enum TaskPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class CreateTaskQueueRequestDto {
    taskId: string;
    taskType: string;
    data: any;
    priority?: TaskPriority;
    delay?: number;
    attempts?: number;
}
export declare class CreateTaskQueueResponseDto {
    success: boolean;
    jobId: string;
    taskId: string;
    queueName: string;
    message: string;
}
