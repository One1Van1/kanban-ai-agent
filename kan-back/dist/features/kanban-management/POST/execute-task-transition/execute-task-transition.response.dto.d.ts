import { TransitionAction } from './execute-task-transition.request.dto';
export interface TransitionMetadata {
    fromStatus: string;
    toStatus: string;
    fromColumn?: string;
    toColumn?: string;
    action: TransitionAction;
    comment?: string;
    resolution?: string;
    executedBy: string;
    executedAt: Date;
}
export declare class ExecuteTaskTransitionResponseDto {
    taskId: string;
    action: TransitionAction;
    fromStatus: string;
    toStatus: string;
    fromColumn?: string;
    toColumn?: string;
    executedBy: string;
    executedAt: Date;
    comment?: string;
    resolution?: string;
    success: boolean;
    historyLogId: string;
}
