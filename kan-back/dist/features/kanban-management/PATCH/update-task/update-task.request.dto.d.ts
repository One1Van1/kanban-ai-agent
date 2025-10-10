export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
    CRITICAL = "critical"
}
export declare class UpdateTaskRequestDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    assigneeEmail?: string;
    assigneeName?: string;
    taskKey?: string;
    tags?: string[];
    dueDate?: string;
    estimatedHours?: number;
    context?: Record<string, any>;
    updateReason?: string;
    updatedByEmail?: string;
    updatedByName?: string;
    agentId?: string;
    triggerType?: string;
    preservePosition?: boolean;
    sendNotifications?: boolean;
}
