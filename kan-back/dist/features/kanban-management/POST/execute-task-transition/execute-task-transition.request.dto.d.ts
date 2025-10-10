export declare enum TransitionAction {
    START_PROGRESS = "start_progress",
    SUBMIT_FOR_REVIEW = "submit_for_review",
    APPROVE = "approve",
    REQUEST_CHANGES = "request_changes",
    COMPLETE = "complete",
    BLOCK = "block",
    UNBLOCK = "unblock",
    REOPEN = "reopen",
    CLOSE = "close"
}
export declare class ExecuteTaskTransitionRequestDto {
    action: TransitionAction;
    toStatus: string;
    toColumn?: string;
    executedBy: string;
    comment?: string;
    resolution?: string;
}
