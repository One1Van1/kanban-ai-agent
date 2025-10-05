import { Test, TestingModule } from '@nestjs/testing';
import { CacheContextController } from './cache-context.controller';
import { CacheContextService } from './cache-context.service';
import { CacheContextRequestDto } from './cache-context.request.dto';
import { CacheContextResponseDto } from './cache-context.response.dto';

describe('CacheContextController', () => {
  let controller: CacheContextController;
  let service: CacheContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheContextController],
      providers: [
        {
          provide: CacheContextService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CacheContextController>(CacheContextController);
    service = module.get<CacheContextService>(CacheContextService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should cache context successfully', async () => {
      const requestDto: CacheContextRequestDto = {
        key: 'task-123-context',
        contextData: {
          taskId: 'TASK-123',
          relatedTasks: ['TASK-124'],
          userComments: ['Great work!'],
        },
        ttl: 600,
      };

      const expectedResponse = new CacheContextResponseDto(
        true,
        'task-123-context',
        600,
        'Context cached successfully',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle context caching with default TTL', async () => {
      const requestDto: CacheContextRequestDto = {
        key: 'task-456-context',
        contextData: {
          taskId: 'TASK-456',
          externalData: { status: 'In Progress' },
        },
      };

      const expectedResponse = new CacheContextResponseDto(
        true,
        'task-456-context',
        600, // default TTL
        'Context cached successfully',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle caching errors', async () => {
      const requestDto: CacheContextRequestDto = {
        key: 'invalid-key',
        contextData: {},
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
