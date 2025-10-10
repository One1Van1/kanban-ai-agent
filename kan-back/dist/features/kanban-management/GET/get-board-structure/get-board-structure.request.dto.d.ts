export declare class GetBoardStructureRequestDto {
    boardId?: string;
    includeTaskCounts?: boolean;
    includeMetadata?: boolean;
    includeStatusTransitions?: boolean;
    includeSampleTasks?: boolean;
    sampleTasksLimit?: number;
    agentId?: string;
    purpose?: string;
}
