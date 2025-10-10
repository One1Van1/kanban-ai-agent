import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class TaskDetailsDto {
    taskId: string;
    taskKey: string;
    taskTitle: string;
    status: string;
    toColumn: string;
    fromColumn: string;
    toStatus: string;
    fromStatus: string;
    createdAt: Date;
    context: Record<string, any>;
    constructor(taskHistory: TaskHistory);
}
export declare class TaskHistoryItemDto {
    id: string;
    taskId: string;
    taskKey: string;
    taskTitle: string;
    action: string;
    toStatus: string;
    fromStatus: string;
    createdAt: Date;
    constructor(taskHistory: TaskHistory);
}
export declare class GetTaskDetailsResponseDto {
    task: TaskDetailsDto;
    history: TaskHistoryItemDto[];
    historyCount: number;
    constructor(latestTask: TaskHistory, history: TaskHistory[]);
}
