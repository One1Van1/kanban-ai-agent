import { ColumnDeleteMode } from './delete-board-column.request.dto';
export interface ColumnDeletionMetadata {
    columnName: string;
    columnType: string;
    position: number;
    boardId: string;
    tasksInColumn: number;
    tasksRelocated: number;
    targetColumnId?: string;
    targetColumnName?: string;
    positionAdjustments: {
        columnId: string;
        oldPosition: number;
        newPosition: number;
    }[];
}
export declare class DeleteBoardColumnResponseDto {
    columnId: string;
    boardId: string;
    columnName: string;
    deleteMode: ColumnDeleteMode;
    deletedBy: string;
    deletedAt: Date;
    deleteReason?: string;
    originalPosition: number;
    tasksInColumn: number;
    tasksRelocated: number;
    targetColumnId?: string;
    targetColumnName?: string;
    positionAdjustments: {
        columnId: string;
        oldPosition: number;
        newPosition: number;
    }[];
    notifiedUsers: string[];
    success: boolean;
    canBeRestored: boolean;
    remainingColumnsInBoard: number;
    historyLogId: string;
}
