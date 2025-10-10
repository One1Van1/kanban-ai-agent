import { Test, TestingModule } from '@nestjs/testing';
import { FetchExternalContextController } from './fetch-external-context.controller';
import { FetchExternalContextService } from './fetch-external-context.service';
import {
  FetchExternalContextQueryDto,
  ExternalSourceType,
} from './fetch-external-context.query.dto';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';

describe('FetchExternalContextController', () => {
  let controller: FetchExternalContextController;
  let service: FetchExternalContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchExternalContextController],
      providers: [
        {
          provide: FetchExternalContextService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchExternalContextController>(
      FetchExternalContextController,
    );
    service = module.get<FetchExternalContextService>(
      FetchExternalContextService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should fetch external context successfully', async () => {
      const taskId = 'task-uuid-123';
      const query: FetchExternalContextQueryDto = {
        sources: [ExternalSourceType.CONFLUENCE, ExternalSourceType.GITHUB],
        keywords: ['authentication', 'user management'],
        searchDepthDays: 30,
        includeRelatedProjects: true,
        maxResultsPerSource: 5,
      };

      const mockExternalContexts = [
        {
          sourceType: ExternalSourceType.CONFLUENCE,
          sourceName: 'Confluence Wiki',
          isAvailable: true,
          lastUpdated: new Date().toISOString(),
          items: [
            {
              id: 'confluence-item-1',
              title: 'Authentication Documentation',
              content: 'Detailed authentication flow documentation...',
              url: 'https://company.atlassian.net/wiki/spaces/DEV/pages/101',
              author: 'developer@example.com',
              createdAt: new Date().toISOString(),
              relevanceScore: 0.95,
              metadata: { space: 'DEV', pageViews: 100 },
            },
          ],
          totalFound: 1,
          searchQuery: 'authentication user management',
        },
      ];

      const expectedResponse = new FetchExternalContextResponseDto(
        true,
        taskId,
        mockExternalContexts,
        query,
        'Собран контекст из 1 внешних источников',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(taskId, query);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(taskId, query);
    });

    it('should handle default query parameters', async () => {
      const taskId = 'task-uuid-456';
      const query: FetchExternalContextQueryDto = {};

      const mockResponse = new FetchExternalContextResponseDto(
        true,
        taskId,
        [],
        query,
        'Контекст из внешних источников не найден',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId, query);

      expect(result).toBeDefined();
      expect(result.taskId).toBe(taskId);
      expect(service.execute).toHaveBeenCalledWith(taskId, query);
    });

    it('should handle specific source types', async () => {
      const taskId = 'task-uuid-789';
      const query: FetchExternalContextQueryDto = {
        sources: [ExternalSourceType.SLACK, ExternalSourceType.GITHUB],
        keywords: ['bug', 'fix'],
        maxResultsPerSource: 3,
      };

      const mockResponse = new FetchExternalContextResponseDto(
        true,
        taskId,
        [],
        query,
        'Поиск завершен',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId, query);

      expect(result.searchParams.sources).toEqual([
        ExternalSourceType.SLACK,
        ExternalSourceType.GITHUB,
      ]);
      expect(result.searchParams.keywords).toEqual(['bug', 'fix']);
      expect(result.searchParams.maxResultsPerSource).toBe(3);
    });

    it('should handle search depth and related projects options', async () => {
      const taskId = 'task-uuid-999';
      const query: FetchExternalContextQueryDto = {
        searchDepthDays: 60,
        includeRelatedProjects: true,
      };

      const mockResponse = new FetchExternalContextResponseDto(
        true,
        taskId,
        [],
        query,
        'Расширенный поиск завершен',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId, query);

      expect(result.searchParams.searchDepthDays).toBe(60);
      expect(result.searchParams.includeRelatedProjects).toBe(true);
    });
  });
});
