export declare enum ActivityResultFilter {
    ALL = "all",
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending"
}
export declare class GetAgentActivityRequestDto {
    agentId: string;
    limit?: number;
    offset?: number;
    result?: ActivityResultFilter;
    taskId?: string;
    fromDate?: string;
    toDate?: string;
}
