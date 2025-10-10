export declare class CreateTaskRequestDto {
    taskKey: string;
    taskTitle: string;
    initialColumn: string;
    initialStatus?: string;
    context?: Record<string, any>;
    agentId?: string;
}
