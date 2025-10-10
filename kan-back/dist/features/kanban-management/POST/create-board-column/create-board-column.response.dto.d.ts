import { ColumnType } from './create-board-column.request.dto';
export interface BoardColumnMetadata {
    boardId: string;
    totalColumns: number;
    columnInsertedAt: number;
    adjacentColumns: {
        before?: string;
        after?: string;
    };
}
export declare class CreateBoardColumnResponseDto {
    columnId: string;
    boardId: string;
    name: string;
    type: ColumnType;
    position: number;
    description?: string;
    color?: string;
    wipLimit?: number;
    createdBy: string;
    createdAt: Date;
    success: boolean;
    totalColumnsInBoard: number;
    adjacentColumns?: {
        before?: string;
        after?: string;
    };
    historyLogId: string;
}
