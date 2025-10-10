export declare class InstructionDto {
    columnId: string;
    columnName: string;
    instruction: string;
    triggerEvent: string;
    conditions?: Record<string, any>;
    actions?: Record<string, any>;
    isActive?: boolean;
    priority?: number;
}
export declare class StoreAgentConfigRequestDto {
    agentId?: string;
    name: string;
    description?: string;
    status?: string;
    config?: Record<string, any>;
    jiraInstanceUrl?: string;
    jiraProjectKey?: string;
    jiraApiToken?: string;
    contextSources?: Record<string, any>;
    notificationSettings?: Record<string, any>;
    createdBy?: string;
    instructions?: InstructionDto[];
}
