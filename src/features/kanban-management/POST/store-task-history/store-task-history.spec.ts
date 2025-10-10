import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreTaskHistoryService } from './store-task-history.service';
import { StoreTaskHistoryRequestDto } from './store-task-history.request.dto';
import { TaskHistory } from 'src/entities/task-history.entity';

describe('StoreTaskHistoryService', () => {
  let service: StoreTaskHistoryService;
  let repository: jest.Mocked<Repository<TaskHistory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreTaskHistoryService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreTaskHistoryService>(StoreTaskHistoryService);
    repository = module.get(getRepositoryToken(TaskHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should store task history successfully', async () => {
      const requestDto: StoreTaskHistoryRequestDto = {
        agentId: 'agent-uuid',
        taskId: 'TASK-123',
        taskKey: 'PROJ-123',
        taskTitle: 'Test Task',
        action: 'status_changed',
        fromStatus: 'To Do',
        toStatus: 'In Progress',
        status: 'pending',
      };

      const mockHistory = {
        id: 'history-uuid',
        ...requestDto,
        createdAt: new Date(),
      };

      repository.create.mockReturnValue(mockHistory as TaskHistory);
      repository.save.mockResolvedValue(mockHistory as TaskHistory);

      const result = await service.execute(requestDto);

      expect(result.historyId).toBe('history-uuid');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Task history stored successfully');
      expect(repository.create).toHaveBeenCalledWith({
        agentId: requestDto.agentId,
        taskId: requestDto.taskId,
        taskKey: requestDto.taskKey,
        taskTitle: requestDto.taskTitle,
        action: requestDto.action,
        fromStatus: requestDto.fromStatus,
        toStatus: requestDto.toStatus,
        fromColumn: undefined,
        toColumn: undefined,
        context: undefined,
        agentResponse: undefined,
        executedInstruction: undefined,
        status: 'pending',
        error: undefined,
        processingTimeMs: undefined,
      });
    });
  });
});
