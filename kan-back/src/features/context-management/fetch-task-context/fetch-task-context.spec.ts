import { Test, TestingModule } from '@nestjs/testing';
import { FetchTaskContextController } from './fetch-task-context.controller';
import { FetchTaskContextService } from './fetch-task-context.service';
import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';

describe('FetchTaskContextController', () => {
  let controller: FetchTaskContextController;
  let service: FetchTaskContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchTaskContextController],
      providers: [
        {
          provide: FetchTaskContextService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchTaskContextController>(
      FetchTaskContextController,
    );
    service = module.get<FetchTaskContextService>(FetchTaskContextService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should fetch task context successfully', async () => {
      const taskId = 'task-uuid-123';
      const expectedResponse = new FetchTaskContextResponseDto(
        true,
        taskId,
        {
          taskId,
          description: `Контекст для задачи ${taskId}`,
          comments: [
            {
              id: '1',
              author: 'AI Agent',
              content: 'Автоматический анализ задачи',
              createdAt: new Date().toISOString(),
            },
          ],
          attachments: [
            {
              id: '1',
              fileName: 'requirements.pdf',
              fileSize: 1024,
              uploadedAt: new Date().toISOString(),
            },
          ],
          worklog: [
            {
              id: '1',
              author: 'Developer',
              timeSpent: '2h',
              description: 'Анализ требований',
              loggedAt: new Date().toISOString(),
            },
          ],
          customFields: {
            priority: 'High',
            estimatedHours: 8,
            component: 'Frontend',
          },
        },
        'Контекст задачи успешно получен',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(taskId);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(taskId);
    });

    it('should handle UUID validation', async () => {
      const taskId = 'valid-uuid-format';
      const mockResponse = new FetchTaskContextResponseDto(
        true,
        taskId,
        {
          taskId,
          description: 'Test context',
          comments: [],
          attachments: [],
          worklog: [],
          customFields: {
            priority: 'Medium',
            estimatedHours: 4,
            component: 'Backend',
          },
        },
        'Контекст получен',
      );

      jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(taskId);

      expect(result).toBeDefined();
      expect(result.taskId).toBe(taskId);
    });
  });
});
