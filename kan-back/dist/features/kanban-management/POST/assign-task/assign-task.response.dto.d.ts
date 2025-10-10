export interface TaskAssignment {
    id: string;
    taskId: string;
    assigneeEmail: string;
    assigneeName?: string;
    assignedByEmail?: string;
    assignedByName?: string;
    assignmentMessage?: string;
    assignedAt: Date;
    context?: Record<string, any>;
    agentId?: string;
    triggerType?: string;
}
export declare class AssignTaskResponseDto {
    success: boolean;
    message: string;
    taskId: string;
    assignment: TaskAssignment;
    timestamp: string;
    metadata?: Record<string, any>;
}
