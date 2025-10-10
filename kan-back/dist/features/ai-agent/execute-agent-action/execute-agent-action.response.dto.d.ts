export declare enum AgentActionResult {
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending",
    SKIPPED = "skipped"
}
export declare class AgentActionOutputDto {
    actionType: string;
    description: string;
    data?: Record<string, any>;
    constructor(data: Partial<AgentActionOutputDto>);
}
export declare class ExecuteAgentActionResponseDto {
    executionId: string;
    agentId: string;
    taskId: string;
    result: AgentActionResult;
    actions: AgentActionOutputDto[];
    summary: string;
    executionTimeMs: number;
    error?: string;
    metadata?: Record<string, any>;
    executedAt: Date;
    constructor(data: Partial<ExecuteAgentActionResponseDto>);
}
