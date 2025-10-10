export declare class ReorderedColumnDto {
    columnId: string;
    columnName: string;
    previousPosition: number;
    newPosition: number;
    positionChanged: boolean;
}
export declare class BoardLayoutDto {
    boardId: string;
    boardName: string;
    totalColumns: number;
    columns: ReorderedColumnDto[];
}
export declare class ReorderBoardColumnsResponseDto {
    boardId: string;
    userId: string;
    userName: string;
    reorderedAt: Date;
    reorderReason?: string;
    columnsChanged: number;
    boardLayout: BoardLayoutDto;
    success: boolean;
    historyLogId: string;
    changesSummary: string;
    previousOrder: number[];
    newOrder: number[];
}
