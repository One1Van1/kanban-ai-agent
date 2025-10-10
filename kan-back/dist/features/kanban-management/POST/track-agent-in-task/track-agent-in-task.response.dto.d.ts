export declare class TrackAgentInTaskResponseDto {
    success: boolean;
    agentId: string;
    taskId: string;
    message: string;
    tracking: {
        agentId: string;
        taskId: string;
        boardId: string;
        columnId: string;
        columnName?: string;
        isActive: boolean;
        startedAt: string;
    };
    nextActions: string[];
}
