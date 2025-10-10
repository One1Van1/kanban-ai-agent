export declare class ColumnStatDto {
    columnId: string;
    name: string;
    taskCount: number;
    color: string;
}
export declare class PriorityStatDto {
    priority: string;
    name: string;
    taskCount: number;
    color: string;
}
export declare class BoardSummaryDataDto {
    boardId: string;
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    columns: ColumnStatDto[];
    priorities: PriorityStatDto[];
    lastUpdated: Date;
    avgTasksPerColumn?: number;
    tasksCreatedToday?: number;
    tasksCompletedToday?: number;
    overdueTasks?: number;
    blockedTasksDuration?: string;
    mostActiveColumn?: string;
    completionRate?: number;
}
export declare class GetBoardSummaryResponseDto {
    success: boolean;
    data: BoardSummaryDataDto;
    message: string;
}
