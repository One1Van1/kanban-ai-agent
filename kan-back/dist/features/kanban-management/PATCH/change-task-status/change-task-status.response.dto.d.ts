import { TaskStatus } from './change-task-status.request.dto';
export interface TaskStatusChange {
    id: string;
    taskId: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
    changedByEmail?: string;
    changedByName?: string;
    statusComment?: string;
    changedAt: Date;
    context?: Record<string, any>;
    agentId?: string;
    triggerType?: string;
    forceChange?: boolean;
}
export declare class ChangeTaskStatusResponseDto {
    success: boolean;
    message: string;
    taskId: string;
    previousStatus: TaskStatus;
    currentStatus: TaskStatus;
    statusChange: TaskStatusChange;
    timestamp: string;
    metadata?: Record<string, any>;
}
