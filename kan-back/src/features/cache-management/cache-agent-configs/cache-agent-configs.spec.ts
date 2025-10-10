import { Test, TestingModule } from '@nestjs/testing';
import { CacheAgentConfigsController } from './cache-agent-configs.controller';
import { CacheAgentConfigsService } from './cache-agent-configs.service';
import { CacheAgentConfigsRequestDto } from './cache-agent-configs.request.dto';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';

describe('CacheAgentConfigsController', () => {
  let controller: CacheAgentConfigsController;
  let service: CacheAgentConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheAgentConfigsController],
      providers: [
        {
          provide: CacheAgentConfigsService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CacheAgentConfigsController>(
      CacheAgentConfigsController,
    );
    service = module.get<CacheAgentConfigsService>(CacheAgentConfigsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should cache agent configuration successfully', async () => {
      const requestDto: CacheAgentConfigsRequestDto = {
        agentId: 'agent-uuid-123',
        configData: {
          name: 'Task Processor Agent',
          instructions: {
            'To Do': 'Analyze task and add initial comments',
            'In Progress': 'Monitor progress and send updates',
          },
          settings: {
            autoAssign: true,
            notifyOnChange: true,
          },
        },
        ttl: 1800,
      };

      const expectedResponse = new CacheAgentConfigsResponseDto(
        true,
        'agent-uuid-123',
        'agent:agent-uuid-123',
        1800,
        'Agent configuration cached successfully',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle agent config caching with default TTL', async () => {
      const requestDto: CacheAgentConfigsRequestDto = {
        agentId: 'agent-uuid-456',
        configData: {
          name: 'Simple Agent',
          instructions: {},
        },
      };

      const expectedResponse = new CacheAgentConfigsResponseDto(
        true,
        'agent-uuid-456',
        'agent:agent-uuid-456',
        1800, // default TTL
        'Agent configuration cached successfully',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle caching errors', async () => {
      const requestDto: CacheAgentConfigsRequestDto = {
        agentId: 'invalid-agent',
        configData: {},
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(new Error('Cache error'));

      await expect(controller.handle(requestDto)).rejects.toThrow(
        'Cache error',
      );
    });
  });
});
