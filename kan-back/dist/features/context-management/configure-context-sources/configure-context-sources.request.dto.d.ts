import { ContextSourceType, ContextPriority } from '../../../types/context.interface';
export declare class ConfigureContextSourcesRequestDto {
    agentId: string;
    name: string;
    description: string;
    type: ContextSourceType;
    priority: ContextPriority;
    enabled: boolean;
    config?: Record<string, any>;
}
