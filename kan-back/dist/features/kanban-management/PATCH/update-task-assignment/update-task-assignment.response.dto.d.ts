import { AssignmentAction, AssignmentDetails } from './update-task-assignment.request.dto';
export interface AssignmentChangeMetadata {
    action: AssignmentAction;
    previousAssignee?: string;
    newAssignee?: string;
    watchersAdded: string[];
    watchersRemoved: string[];
    assignmentHistory: {
        userId: string;
        action: string;
        timestamp: Date;
    }[];
}
export declare class UpdateTaskAssignmentResponseDto {
    taskId: string;
    action: AssignmentAction;
    assignee?: string;
    previousAssignee?: string;
    watchers?: string[];
    assignmentDetails?: AssignmentDetails[];
    updatedBy: string;
    updatedAt: Date;
    assignmentReason?: string;
    watchersAdded: string[];
    watchersRemoved: string[];
    notificationsSent: boolean;
    assignmentPriority?: string;
    success: boolean;
    assignmentVersion: number;
    historyLogId: string;
}
