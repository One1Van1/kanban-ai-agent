import { Test, TestingModule } from '@nestjs/testing';
import { ConfigureContextSourcesController } from './configure-context-sources.controller';
import { ConfigureContextSourcesService } from './configure-context-sources.service';
import { ConfigureContextSourcesRequestDto } from './configure-context-sources.request.dto';
import {
  ContextSourceType,
  ContextPriority,
} from '../../../types/context.interface';

describe('ConfigureContextSourcesController', () => {
  let controller: ConfigureContextSourcesController;
  let service: ConfigureContextSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigureContextSourcesController],
      providers: [ConfigureContextSourcesService],
    }).compile();

    controller = module.get<ConfigureContextSourcesController>(
      ConfigureContextSourcesController,
    );
    service = module.get<ConfigureContextSourcesService>(
      ConfigureContextSourcesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should configure context source successfully', async () => {
      const request: ConfigureContextSourcesRequestDto = {
        agentId: 'agent_123',
        name: 'Test Context Source',
        description: 'Test description',
        type: ContextSourceType.TASK_DETAILS,
        priority: ContextPriority.HIGH,
        enabled: true,
        config: { test: true },
      };

      const result = await controller.handle(request);

      expect(result).toBeDefined();
      expect(result.message).toBe('Context source configured successfully');
      expect(result.contextSource).toBeDefined();
      expect(result.contextSource.agentId).toBe(request.agentId);
      expect(result.contextSource.name).toBe(request.name);
      expect(result.contextSource.type).toBe(request.type);
      expect(result.contextSource.priority).toBe(request.priority);
      expect(result.contextSource.enabled).toBe(request.enabled);
      expect(result.contextSource.id).toBeDefined();
      expect(result.contextSource.createdAt).toBeDefined();
      expect(result.contextSource.updatedAt).toBeDefined();
    });

    it('should handle external API context source with proper validation', async () => {
      const request: ConfigureContextSourcesRequestDto = {
        agentId: 'agent_456',
        name: 'External API Source',
        description: 'Fetches data from external API',
        type: ContextSourceType.EXTERNAL_API,
        priority: ContextPriority.MEDIUM,
        enabled: true,
        config: { url: 'https://api.example.com/data' },
      };

      const result = await controller.handle(request);

      expect(result).toBeDefined();
      expect(result.contextSource.type).toBe(ContextSourceType.EXTERNAL_API);
      expect(result.contextSource.config.url).toBe(
        'https://api.example.com/data',
      );
    });

    it('should throw error for external API without URL', async () => {
      const request: ConfigureContextSourcesRequestDto = {
        agentId: 'agent_789',
        name: 'Invalid External API Source',
        description: 'Missing URL config',
        type: ContextSourceType.EXTERNAL_API,
        priority: ContextPriority.LOW,
        enabled: true,
        config: {},
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'External API context source requires URL configuration',
      );
    });

    it('should validate related tasks maxResults limit', async () => {
      const request: ConfigureContextSourcesRequestDto = {
        agentId: 'agent_999',
        name: 'Related Tasks Source',
        description: 'Too many results',
        type: ContextSourceType.RELATED_TASKS,
        priority: ContextPriority.HIGH,
        enabled: true,
        config: { maxResults: 150 },
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'Related tasks maxResults cannot exceed 100',
      );
    });
  });
});
