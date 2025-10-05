import { Test, TestingModule } from '@nestjs/testing';
import { FetchRelatedTasksController } from './fetch-related-tasks.controller';
import { FetchRelatedTasksService } from './fetch-related-tasks.service';
import {
  FetchRelatedTasksQueryDto,
  RelationshipType,
} from './fetch-related-tasks.query.dto';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';

describe('FetchRelatedTasksController', () => {
  let controller: FetchRelatedTasksController;
  let service: FetchRelatedTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchRelatedTasksController],
      providers: [
        {
          provide: FetchRelatedTasksService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchRelatedTasksController>(
      FetchRelatedTasksController,
    );
    service = module.get<FetchRelatedTasksService>(FetchRelatedTasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should fetch related tasks successfully', async () => {
      const taskId = 'task-uuid-123';
      const query: FetchRelatedTasksQueryDto = {
        relationshipType: RelationshipType.RELATED_TO,
        limit: 5,
        includeSubtasks: true,
        includeParents: true,
      };

      const mockRelatedTasks = [
        {
          id: 'related-task-1',
          key: 'TASK-1001',
          title: 'Связанная задача 1',
          status: 'In Progress',
          priority: 'High',
          assignee: 'user-1@example.com',
          relationshipType: RelationshipType.RELATED_TO,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const expectedResponse = new FetchRelatedTasksResponseDto(
        true,
        taskId,
        mockRelatedTasks,
        query,
        'Найдено 1 связанных задач',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(taskId, query);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(taskId, query);
    });

    it('should handle default query parameters', async () => {
      const taskId = 'task-uuid-456';
      const query: FetchRelatedTasksQueryDto = {};

      const mockResponse = new FetchRelatedTasksResponseDto(
        true,
        taskId,
        [],
        query,
        'Связанные задачи не найдены',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId, query);

      expect(result).toBeDefined();
      expect(result.taskId).toBe(taskId);
      expect(service.execute).toHaveBeenCalledWith(taskId, query);
    });

    it('should handle relationship type filter', async () => {
      const taskId = 'task-uuid-789';
      const query: FetchRelatedTasksQueryDto = {
        relationshipType: RelationshipType.BLOCKS,
        limit: 3,
      };

      const mockResponse = new FetchRelatedTasksResponseDto(
        true,
        taskId,
        [],
        query,
        'Заблокированные задачи не найдены',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId, query);

      expect(result.searchParams.relationshipType).toBe(
        RelationshipType.BLOCKS,
      );
      expect(result.searchParams.limit).toBe(3);
    });
  });
});
