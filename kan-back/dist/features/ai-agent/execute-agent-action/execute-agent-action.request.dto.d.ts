export declare enum AgentActionTrigger {
    TASK_MOVED_TO_COLUMN = "task_moved_to_column",
    TASK_ASSIGNED = "task_assigned",
    TASK_PRIORITY_CHANGED = "task_priority_changed",
    TASK_DUE_DATE_APPROACHING = "task_due_date_approaching",
    MANUAL_TRIGGER = "manual_trigger"
}
export declare class ExecuteAgentActionRequestDto {
    agentId: string;
    taskId: string;
    boardId: string;
    columnId: string;
    columnName: string;
    triggerType: AgentActionTrigger;
    taskData: Record<string, any>;
    additionalContext?: Record<string, any>;
}
