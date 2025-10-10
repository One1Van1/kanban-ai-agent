import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class TaskMovedDto {
    taskId: string;
    taskKey: string;
    taskTitle: string;
    fromColumn: string;
    toColumn: string;
    fromStatus: string;
    toStatus: string;
    movedAt: Date;
    action: string;
    constructor(moveHistory: TaskHistory);
}
export declare class MoveTaskResponseDto {
    task: TaskMovedDto;
    success: boolean;
    message: string;
    context: Record<string, any>;
    constructor(moveHistory: TaskHistory, previousState: TaskHistory);
}
