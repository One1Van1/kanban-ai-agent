import { ColumnType } from './update-board-column.request.dto';
export interface ColumnUpdateMetadata {
    fieldsUpdated: string[];
    previousValues: Record<string, any>;
    newValues: Record<string, any>;
    positionChanges?: {
        from: number;
        to: number;
        affectedColumns: string[];
    };
    updateReason?: string;
    updatedBy: string;
    updatedAt: Date;
}
export declare class UpdateBoardColumnResponseDto {
    columnId: string;
    boardId: string;
    name: string;
    type: ColumnType;
    position: number;
    description?: string;
    color?: string;
    wipLimit?: number;
    isActive: boolean;
    updatedBy: string;
    updatedAt: Date;
    fieldsUpdated: string[];
    previousValues: Record<string, any>;
    positionChanges?: {
        from: number;
        to: number;
        affectedColumns: string[];
    };
    updateComment?: string;
    success: boolean;
    version: number;
    currentTaskCount: number;
    historyLogId: string;
}
