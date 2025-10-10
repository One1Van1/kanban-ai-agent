export declare class ConfigureAgentResponseDto {
    success: boolean;
    agentId: string;
    message: string;
    agent: {
        id: string;
        name: string;
        description?: string;
        instructions: string;
        model: string;
        temperature: number;
        maxTokens: number;
        isActive: boolean;
        updatedAt: string;
    };
}
