export declare class AssignTaskRequestDto {
    assigneeEmail: string;
    assigneeName?: string;
    assignedByEmail?: string;
    assignedByName?: string;
    assignmentMessage?: string;
    context?: Record<string, any>;
    agentId?: string;
    triggerType?: string;
}
