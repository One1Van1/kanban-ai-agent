export declare class CreateAgentRequestDto {
    name: string;
    description?: string;
    instructions: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    isActive?: boolean;
    userId?: string;
}
