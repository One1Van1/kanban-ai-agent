import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigureContextSourcesRequestDto } from './configure-context-sources.request.dto';
import {
  ConfigureContextSourcesResponseDto,
  ContextSourceResponseDto,
} from './configure-context-sources.response.dto';
import {
  ContextSource,
  ContextSourceType,
} from '../../../types/context.interface';

@Injectable()
export class ConfigureContextSourcesService {
  private readonly logger = new Logger(ConfigureContextSourcesService.name);
  private readonly contextSources = new Map<string, ContextSource>();

  async execute(
    request: ConfigureContextSourcesRequestDto,
  ): Promise<ConfigureContextSourcesResponseDto> {
    this.logger.log(`Configuring context source for agent: ${request.agentId}`);

    try {
      // Validate configuration based on context source type
      this.validateConfig(request.type, request.config);

      // Create context source
      const contextSource: ContextSource = {
        id: uuidv4(),
        type: request.type,
        name: request.name,
        description: request.description,
        priority: request.priority,
        enabled: request.enabled,
        config: request.config || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store context source (in real implementation this would go to database)
      const sourceKey = `${request.agentId}:${contextSource.id}`;
      this.contextSources.set(sourceKey, contextSource);

      this.logger.log(
        `Context source configured successfully: ${contextSource.id}`,
      );

      const responseDto = new ContextSourceResponseDto({
        id: contextSource.id,
        agentId: request.agentId,
        name: contextSource.name,
        description: contextSource.description,
        type: contextSource.type,
        priority: contextSource.priority,
        enabled: contextSource.enabled,
        config: contextSource.config,
        createdAt: contextSource.createdAt,
        updatedAt: contextSource.updatedAt,
      });

      return new ConfigureContextSourcesResponseDto(
        responseDto,
        'Context source configured successfully',
      );
    } catch (error) {
      this.logger.error(
        `Failed to configure context source: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private validateConfig(
    type: ContextSourceType,
    config?: Record<string, any>,
  ): void {
    switch (type) {
      case ContextSourceType.EXTERNAL_API:
        if (!config?.url) {
          throw new Error(
            'External API context source requires URL configuration',
          );
        }
        break;
      case ContextSourceType.RELATED_TASKS:
        if (config?.maxResults && config.maxResults > 100) {
          throw new Error('Related tasks maxResults cannot exceed 100');
        }
        break;
      case ContextSourceType.TASK_DETAILS:
      case ContextSourceType.TASK_COMMENTS:
      case ContextSourceType.TASK_HISTORY:
      case ContextSourceType.FILE_ATTACHMENTS:
      case ContextSourceType.USER_PROFILE:
      case ContextSourceType.PROJECT_SETTINGS:
        // These types have default configurations
        break;
      default:
        throw new Error(`Unsupported context source type: ${type}`);
    }
  }

  async getContextSourcesByAgent(agentId: string): Promise<ContextSource[]> {
    const sources: ContextSource[] = [];
    for (const [key, source] of this.contextSources) {
      if (key.startsWith(`${agentId}:`)) {
        sources.push(source);
      }
    }
    return sources;
  }

  async getContextSource(
    agentId: string,
    sourceId: string,
  ): Promise<ContextSource | null> {
    const key = `${agentId}:${sourceId}`;
    return this.contextSources.get(key) || null;
  }
}
