import { Test, TestingModule } from '@nestjs/testing';
import { GetCachedContextController } from './get-cached-context.controller';
import { GetCachedContextService } from './get-cached-context.service';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';

describe('GetCachedContextController', () => {
  let controller: GetCachedContextController;
  let service: GetCachedContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetCachedContextController],
      providers: [
        {
          provide: GetCachedContextService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetCachedContextController>(
      GetCachedContextController,
    );
    service = module.get<GetCachedContextService>(GetCachedContextService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should retrieve cached context successfully', async () => {
      const cacheKey = 'task-123-context';
      const contextData = {
        taskId: 'TASK-123',
        relatedTasks: ['TASK-124'],
        userComments: ['Great work!'],
      };

      const expectedResponse = new GetCachedContextResponseDto(
        true,
        cacheKey,
        contextData,
        'Context retrieved successfully',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(cacheKey);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(cacheKey);
    });

    it('should handle cache miss', async () => {
      const cacheKey = 'non-existent-key';

      const expectedResponse = new GetCachedContextResponseDto(
        false,
        cacheKey,
        null,
        'Context not found in cache',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(cacheKey);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(cacheKey);
    });

    it('should handle retrieval errors', async () => {
      const cacheKey = 'error-key';

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(new Error('Cache retrieval error'));

      await expect(controller.handle(cacheKey)).rejects.toThrow(
        'Cache retrieval error',
      );
    });
  });
});
