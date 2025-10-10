import { TaskPriority, TaskType, TaskCustomField } from './update-task-details.request.dto';
export interface TaskUpdateMetadata {
    fieldsUpdated: string[];
    previousValues: Record<string, any>;
    newValues: Record<string, any>;
    updateReason?: string;
    updatedBy: string;
    updatedAt: Date;
}
export declare class UpdateTaskDetailsResponseDto {
    taskId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    type: TaskType;
    assignee?: string;
    reporter?: string;
    labels?: string[];
    estimatedHours?: number;
    storyPoints?: number;
    dueDate?: string;
    customFields?: TaskCustomField[];
    updatedBy: string;
    updatedAt: Date;
    fieldsUpdated: string[];
    previousValues: Record<string, any>;
    updateComment?: string;
    success: boolean;
    version: number;
    historyLogId: string;
}
