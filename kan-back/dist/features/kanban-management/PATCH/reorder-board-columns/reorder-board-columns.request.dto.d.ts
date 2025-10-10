export declare class ColumnOrderDto {
    columnId: string;
    position: number;
    columnName?: string;
}
export declare class ReorderBoardColumnsRequestDto {
    boardId: string;
    columnOrder: ColumnOrderDto[];
    userId: string;
    reorderReason?: string;
    validateComplete?: boolean;
}
