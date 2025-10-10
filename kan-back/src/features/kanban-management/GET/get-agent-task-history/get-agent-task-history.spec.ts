import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAgentTaskHistoryService } from './get-agent-task-history.service';
import { TaskHistory } from '@/entities/task-history.entity';
import { GetAgentTaskHistoryQueryDto } from './get-agent-task-history.request.dto';

describe('GetAgentTaskHistoryService', () => {
  let service: GetAgentTaskHistoryService;
  let repository: jest.Mocked<Repository<TaskHistory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAgentTaskHistoryService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetAgentTaskHistoryService>(
      GetAgentTaskHistoryService,
    );
    repository = module.get(getRepositoryToken(TaskHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should retrieve task history for agent with default limit', async () => {
      const agentId = 'agent-uuid';
      const query: GetAgentTaskHistoryQueryDto = {};
      const mockHistories = [
        {
          id: 'history-1',
          agentId,
          taskId: 'TASK-1',
          taskKey: 'PROJ-1',
          taskTitle: 'Test Task 1',
          action: 'status_changed',
          status: 'completed',
          createdAt: new Date(),
        },
        {
          id: 'history-2',
          agentId,
          taskId: 'TASK-2',
          taskKey: 'PROJ-2',
          taskTitle: 'Test Task 2',
          action: 'created',
          status: 'pending',
          createdAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(mockHistories as TaskHistory[]);

      const result = await service.execute(agentId, query);

      expect(result.agentId).toBe(agentId);
      expect(result.count).toBe(2);
      expect(result.items).toEqual(mockHistories);
      expect(result.success).toBe(true);
      expect(repository.find).toHaveBeenCalledWith({
        where: { agentId },
        order: { createdAt: 'DESC' },
        take: 50, // default limit
      });
    });

    it('should retrieve task history with custom limit', async () => {
      const agentId = 'agent-uuid';
      const query: GetAgentTaskHistoryQueryDto = { limit: 10 };
      const mockHistories: TaskHistory[] = [];

      repository.find.mockResolvedValue(mockHistories);

      const result = await service.execute(agentId, query);

      expect(result.agentId).toBe(agentId);
      expect(result.count).toBe(0);
      expect(result.items).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { agentId },
        order: { createdAt: 'DESC' },
        take: 10, // custom limit
      });
    });
  });
});
