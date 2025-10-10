import { TaskPriority } from './update-task.request.dto';
export interface TaskUpdateDetails {
    field: string;
    oldValue: any;
    newValue: any;
    updatedAt: Date;
}
export interface UpdatedTask {
    id: string;
    taskId: string;
    taskKey?: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    assigneeEmail?: string;
    assigneeName?: string;
    tags?: string[];
    dueDate?: string;
    estimatedHours?: number;
    currentColumn: string;
    currentStatus: string;
    context?: Record<string, any>;
    updatedAt: Date;
    updatedBy?: string;
    agentId?: string;
}
export declare class UpdateTaskResponseDto {
    success: boolean;
    message: string;
    taskId: string;
    updatedTask: UpdatedTask;
    changes: TaskUpdateDetails[];
    timestamp: string;
    metadata?: Record<string, any>;
}
