import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTaskHistoryService } from './get-task-history.service';
import { TaskHistory } from '../../../entities/task-history.entity';

describe('GetTaskHistoryService', () => {
  let service: GetTaskHistoryService;
  let repository: jest.Mocked<Repository<TaskHistory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskHistoryService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetTaskHistoryService>(GetTaskHistoryService);
    repository = module.get(getRepositoryToken(TaskHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should retrieve task history for specific task', async () => {
      const taskId = 'TASK-123';
      const mockHistories = [
        {
          id: 'history-1',
          agentId: 'agent-uuid-1',
          taskId,
          taskKey: 'PROJ-123',
          taskTitle: 'Test Task',
          action: 'created',
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: 'history-2',
          agentId: 'agent-uuid-2',
          taskId,
          taskKey: 'PROJ-123',
          taskTitle: 'Test Task',
          action: 'status_changed',
          status: 'completed',
          createdAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(mockHistories as TaskHistory[]);

      const result = await service.execute(taskId);

      expect(result.taskId).toBe(taskId);
      expect(result.count).toBe(2);
      expect(result.items).toEqual(mockHistories);
      expect(result.success).toBe(true);
      expect(repository.find).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no history found', async () => {
      const taskId = 'TASK-404';
      const mockHistories: TaskHistory[] = [];

      repository.find.mockResolvedValue(mockHistories);

      const result = await service.execute(taskId);

      expect(result.taskId).toBe(taskId);
      expect(result.count).toBe(0);
      expect(result.items).toEqual([]);
      expect(result.success).toBe(true);
    });
  });
});
