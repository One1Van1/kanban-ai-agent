import { LabelOperation } from './update-task-labels.request.dto';
export interface LabelChange {
    labelName: string;
    operation: 'added' | 'removed';
    timestamp: Date;
}
export declare class UpdateTaskLabelsResponseDto {
    taskId: string;
    operation: LabelOperation;
    currentLabels: string[];
    addedLabels: string[];
    removedLabels: string[];
    totalLabelsCount: number;
    updatedAt: Date;
    updatedBy?: string;
    updateReason?: string;
    success: boolean;
    labelChanges: LabelChange[];
    historyLogId: string;
}
