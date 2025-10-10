export declare class CreateAgentResponseDto {
    success: boolean;
    agentId: string;
    name: string;
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
        createdAt: string;
    };
}
