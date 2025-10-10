export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in-progress",
    IN_REVIEW = "in-review",
    TESTING = "testing",
    DONE = "done",
    BLOCKED = "blocked",
    CANCELLED = "cancelled"
}
export declare class ChangeTaskStatusRequestDto {
    newStatus: TaskStatus;
    statusComment?: string;
    changedByEmail?: string;
    changedByName?: string;
    context?: Record<string, any>;
    agentId?: string;
    triggerType?: string;
    forceChange?: boolean;
}
