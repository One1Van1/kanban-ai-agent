import { ConfigureContextSourcesRequestDto } from './configure-context-sources.request.dto';
import { ConfigureContextSourcesResponseDto } from './configure-context-sources.response.dto';
import { ContextSource } from '../../../types/context.interface';
export declare class ConfigureContextSourcesService {
    private readonly logger;
    private readonly contextSources;
    execute(request: ConfigureContextSourcesRequestDto): Promise<ConfigureContextSourcesResponseDto>;
    private validateConfig;
    getContextSourcesByAgent(agentId: string): Promise<ContextSource[]>;
    getContextSource(agentId: string, sourceId: string): Promise<ContextSource | null>;
}
