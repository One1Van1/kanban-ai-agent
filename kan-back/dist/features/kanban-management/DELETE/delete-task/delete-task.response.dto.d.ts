import { DeleteMode } from './delete-task.request.dto';
export interface TaskDeletionMetadata {
    deletionMode: DeleteMode;
    taskTitle: string;
    taskKey: string;
    originalStatus: string;
    originalColumn: string;
    assignee?: string;
    watchers: string[];
    relatedTasks: string[];
    attachmentsDeleted: number;
    commentsDeleted: number;
    historyEntriesArchived: number;
    deletedBy: string;
    deletedAt: Date;
    deleteReason?: string;
}
export declare class DeleteTaskResponseDto {
    taskId: string;
    taskKey: string;
    taskTitle: string;
    deleteMode: DeleteMode;
    deletedBy: string;
    deletedAt: Date;
    deleteReason?: string;
    originalStatus: string;
    originalColumn: string;
    assignee?: string;
    watchers: string[];
    relatedTasks: string[];
    attachmentsDeleted: number;
    commentsDeleted: number;
    historyEntriesArchived: number;
    notifiedUsers: string[];
    success: boolean;
    canBeRestored: boolean;
    restorationDeadline?: Date;
    historyLogId: string;
}
