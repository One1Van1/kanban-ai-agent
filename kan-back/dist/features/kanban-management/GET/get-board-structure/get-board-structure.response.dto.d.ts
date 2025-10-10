export interface ColumnInfo {
    id: string;
    name: string;
    displayName: string;
    order: number;
    taskCount?: number;
    allowedStatuses: string[];
    statusTransitions?: string[];
    wipLimit?: number;
    description?: string;
    color?: string;
    metadata?: Record<string, any>;
    sampleTasks?: TaskSample[];
}
export interface TaskSample {
    id: string;
    title: string;
    status: string;
    assignee?: string;
    priority?: string;
    createdAt: Date;
}
export interface BoardWorkflow {
    name: string;
    description: string;
    allowedTransitions: Record<string, string[]>;
    statuses: string[];
}
export declare class GetBoardStructureResponseDto {
    success: boolean;
    message: string;
    boardId: string;
    boardName: string;
    columns: ColumnInfo[];
    workflow: BoardWorkflow;
    totalTasks: number;
    timestamp: string;
    metadata?: Record<string, any>;
}
