import { BoardDeleteMode } from './delete-board.request.dto';
export interface BoardDeletionMetadata {
    boardName: string;
    boardType: string;
    columnsCount: number;
    tasksCount: number;
    membersCount: number;
    filesCount: number;
    createdAt: Date;
    lastActivityAt: Date;
}
export interface TaskRelocation {
    taskId: string;
    taskTitle: string;
    fromBoardId: string;
    toBoardId: string;
    newColumnId: string;
    relocatedAt: Date;
}
export interface FilesDeletion {
    totalFiles: number;
    deletedFiles: number;
    failedDeletions: string[];
    totalSizeDeleted: number;
}
export declare class DeleteBoardResponseDto {
    boardId: string;
    boardName: string;
    deleteMode: BoardDeleteMode;
    deletedBy: string;
    deletedAt: Date;
    deleteReason?: string;
    columnsDeleted: number;
    tasksInBoard: number;
    tasksRelocated: number;
    targetBoardId?: string;
    targetBoardName?: string;
    taskRelocations: TaskRelocation[];
    notifiedMembers: string[];
    success: boolean;
    canBeRestored: boolean;
    backupPath?: string;
    filesDeletion?: FilesDeletion;
    historyLogId: string;
}
