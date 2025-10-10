import { ContextSourceType, ContextPriority } from '../../../types/context.interface';
export declare class ContextSourceResponseDto {
    id: string;
    agentId: string;
    name: string;
    description: string;
    type: ContextSourceType;
    priority: ContextPriority;
    enabled: boolean;
    config: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<ContextSourceResponseDto>);
}
export declare class ConfigureContextSourcesResponseDto {
    contextSource: ContextSourceResponseDto;
    message: string;
    constructor(contextSource: ContextSourceResponseDto, message: string);
}
