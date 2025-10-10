export declare enum TriggerConditionType {
    TASK_MOVED_TO_COLUMN = "task_moved_to_column",
    TASK_ASSIGNED = "task_assigned",
    TASK_PRIORITY_CHANGED = "task_priority_changed",
    TASK_DUE_DATE_APPROACHING = "task_due_date_approaching"
}
export declare enum TriggerOperator {
    EQUALS = "equals",
    CONTAINS = "contains",
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than"
}
export declare class AgentTriggerConditionDto {
    type: TriggerConditionType;
    value?: string;
    operator?: TriggerOperator;
}
export declare class ConfigureColumnInstructionsRequestDto {
    agentId: string;
    boardId: string;
    columnId: string;
    columnName: string;
    instructions: string;
    triggerConditions?: AgentTriggerConditionDto[];
    isActive: boolean;
}
