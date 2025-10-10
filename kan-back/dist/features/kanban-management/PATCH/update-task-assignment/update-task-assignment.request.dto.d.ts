export declare enum AssignmentAction {
    ASSIGN = "assign",
    REASSIGN = "reassign",
    UNASSIGN = "unassign",
    ADD_WATCHER = "add_watcher",
    REMOVE_WATCHER = "remove_watcher"
}
export declare class AssignmentDetails {
    userId: string;
    role: string;
    startDate?: string;
    endDate?: string;
}
export declare class UpdateTaskAssignmentRequestDto {
    action: AssignmentAction;
    assignee?: string;
    watchers?: string[];
    assignmentDetails?: AssignmentDetails[];
    updatedBy: string;
    assignmentReason?: string;
    notifyAssignees?: boolean;
    assignmentPriority?: string;
}
