export declare enum TaskPriority {
    LOWEST = "lowest",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    HIGHEST = "highest"
}
export declare enum TaskType {
    TASK = "task",
    BUG = "bug",
    STORY = "story",
    EPIC = "epic",
    SUBTASK = "subtask"
}
export declare class TaskCustomField {
    name: string;
    value: string;
}
export declare class UpdateTaskDetailsRequestDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    type?: TaskType;
    assignee?: string;
    reporter?: string;
    labels?: string[];
    estimatedHours?: number;
    storyPoints?: number;
    dueDate?: string;
    customFields?: TaskCustomField[];
    updatedBy: string;
    updateComment?: string;
}
