export declare enum ActivityResult {
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending"
}
export declare class AgentActivityResponseDto {
    id: string;
    agentId: string;
    taskId: string;
    action: string;
    result: ActivityResult;
    input: any;
    output?: any;
    error?: string;
    executionTime: number;
    createdAt: Date;
    constructor(data: Partial<AgentActivityResponseDto>);
}
export declare class GetAgentActivityResponseDto {
    activities: AgentActivityResponseDto[];
    total: number;
    count: number;
    offset: number;
    limit: number;
    summary: {
        successCount: number;
        errorCount: number;
        pendingCount: number;
        avgExecutionTime: number;
    };
    constructor(data: Partial<GetAgentActivityResponseDto>);
}
