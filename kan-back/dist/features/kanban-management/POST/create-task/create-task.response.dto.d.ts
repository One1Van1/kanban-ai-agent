import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class CreatedTaskDto {
    id: string;
    taskId: string;
    taskKey: string;
    taskTitle: string;
    initialColumn: string;
    initialStatus: string;
    action: string;
    createdAt: Date;
    context: Record<string, any>;
    constructor(taskHistory: TaskHistory);
}
export declare class CreateTaskResponseDto {
    task: CreatedTaskDto;
    success: boolean;
    message: string;
    constructor(taskHistory: TaskHistory);
}
