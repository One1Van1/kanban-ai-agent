export declare class MoveTaskResponseDto {
    success: boolean;
    taskKey: string;
    previousStatus: string;
    newStatus: string;
    message: string;
    updatedTask?: any;
    error?: string;
    constructor(success: boolean, taskKey: string, previousStatus: string, newStatus: string, message: string, updatedTask?: any, error?: string);
}
