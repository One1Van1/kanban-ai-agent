import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskLabelsService } from './update-task-labels.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  UpdateTaskLabelsRequestDto,
  LabelOperation,
} from './update-task-labels.request.dto';

describe('UpdateTaskLabelsService', () => {
  let service: UpdateTaskLabelsService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTask = {
    id: 'hist-123',
    taskId: 'task-123',
    taskKey: 'TASK-123',
    taskTitle: 'Test Task',
    action: 'task_created',
    fromStatus: 'To Do',
    toStatus: 'In Progress',
    fromColumn: 'To Do',
    toColumn: 'In Progress',
    createdAt: new Date('2024-01-10T08:00:00.000Z'),
  };

  const mockLabelsRecord = {
    id: 'hist-labels-123',
    taskId: 'task-123',
    action: 'labels_updated',
    context: {
      taskData: {
        labels: ['bug', 'frontend'],
      },
    },
    agentResponse: {
      labels: ['bug', 'frontend'],
    },
    createdAt: new Date('2024-01-12T08:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskLabelsService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateTaskLabelsService>(UpdateTaskLabelsService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const taskId = 'task-123';
    const mockRequest: UpdateTaskLabelsRequestDto = {
      operation: LabelOperation.ADD,
      labels: ['high-priority', 'backend'],
      updatedBy: 'user-123',
      updateReason: 'Added priority after triage',
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where && Array.isArray(options.where)) {
          return Promise.resolve(mockLabelsRecord);
        }
        return Promise.resolve(null);
      });
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully add labels to task', async () => {
      const result = await service.execute(taskId, mockRequest);

      expect(result).toEqual({
        taskId: 'task-123',
        operation: LabelOperation.ADD,
        currentLabels: ['backend', 'bug', 'frontend', 'high-priority'], // sorted
        addedLabels: ['high-priority', 'backend'],
        removedLabels: [],
        totalLabelsCount: 4,
        updatedAt: expect.any(Date),
        updatedBy: 'user-123',
        updateReason: 'Added priority after triage',
        success: true,
        labelChanges: [
          {
            labelName: 'high-priority',
            operation: 'added',
            timestamp: expect.any(Date),
          },
          {
            labelName: 'backend',
            operation: 'added',
            timestamp: expect.any(Date),
          },
        ],
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully remove labels from task', async () => {
      const removeRequest: UpdateTaskLabelsRequestDto = {
        operation: LabelOperation.REMOVE,
        labels: ['bug'],
        updatedBy: 'user-456',
      };

      const result = await service.execute(taskId, removeRequest);

      expect(result.operation).toBe(LabelOperation.REMOVE);
      expect(result.currentLabels).toEqual(['frontend']);
      expect(result.addedLabels).toEqual([]);
      expect(result.removedLabels).toEqual(['bug']);
      expect(result.totalLabelsCount).toBe(1);
      expect(result.labelChanges).toHaveLength(1);
      expect(result.labelChanges[0]).toEqual({
        labelName: 'bug',
        operation: 'removed',
        timestamp: expect.any(Date),
      });
    });

    it('should successfully replace all labels', async () => {
      const replaceRequest: UpdateTaskLabelsRequestDto = {
        operation: LabelOperation.REPLACE,
        labels: ['feature', 'ready-for-review'],
        updatedBy: 'user-789',
      };

      const result = await service.execute(taskId, replaceRequest);

      expect(result.operation).toBe(LabelOperation.REPLACE);
      expect(result.currentLabels).toEqual(['feature', 'ready-for-review']);
      expect(result.addedLabels).toEqual(['feature', 'ready-for-review']);
      expect(result.removedLabels).toEqual(['bug', 'frontend']);
      expect(result.totalLabelsCount).toBe(2);
      expect(result.labelChanges).toHaveLength(4); // 2 removed + 2 added
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(null);
        }
        return Promise.resolve(mockLabelsRecord);
      });

      await expect(service.execute(taskId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle task with no existing labels', async () => {
      mockTaskHistoryRepository.findOne.mockImplementation((options) => {
        if (options.where?.action === 'task_created') {
          return Promise.resolve(mockTask);
        }
        if (options.where && Array.isArray(options.where)) {
          return Promise.resolve(null); // No labels record
        }
        return Promise.resolve(null);
      });

      const result = await service.execute(taskId, mockRequest);

      expect(result.currentLabels).toEqual(['backend', 'high-priority']);
      expect(result.addedLabels).toEqual(['high-priority', 'backend']);
      expect(result.removedLabels).toEqual([]);
      expect(result.totalLabelsCount).toBe(2);
    });

    it('should not add duplicate labels', async () => {
      const duplicateRequest: UpdateTaskLabelsRequestDto = {
        operation: LabelOperation.ADD,
        labels: ['bug', 'new-label'], // 'bug' already exists
        updatedBy: 'user-123',
      };

      const result = await service.execute(taskId, duplicateRequest);

      expect(result.addedLabels).toEqual(['new-label']);
      expect(result.currentLabels).toContain('bug');
      expect(result.currentLabels).toContain('new-label');
      expect(result.labelChanges).toHaveLength(1); // Only new-label added
    });

    it('should handle removing non-existent labels gracefully', async () => {
      const removeNonExistentRequest: UpdateTaskLabelsRequestDto = {
        operation: LabelOperation.REMOVE,
        labels: ['non-existent-label', 'bug'],
        updatedBy: 'user-456',
      };

      const result = await service.execute(taskId, removeNonExistentRequest);

      expect(result.removedLabels).toEqual(['bug']);
      expect(result.labelChanges).toHaveLength(1);
      expect(result.labelChanges[0].labelName).toBe('bug');
    });

    it('should sort labels consistently', async () => {
      const result = await service.execute(taskId, mockRequest);

      expect(result.currentLabels).toEqual([
        'backend',
        'bug',
        'frontend',
        'high-priority',
      ]);
      // Verify it's sorted alphabetically
      const sorted = [...result.currentLabels].sort();
      expect(result.currentLabels).toEqual(sorted);
    });

    it('should handle empty labels array', async () => {
      const emptyRequest: UpdateTaskLabelsRequestDto = {
        operation: LabelOperation.REPLACE,
        labels: [],
        updatedBy: 'user-123',
      };

      const result = await service.execute(taskId, emptyRequest);

      expect(result.currentLabels).toEqual([]);
      expect(result.addedLabels).toEqual([]);
      expect(result.removedLabels).toEqual(['bug', 'frontend']);
      expect(result.totalLabelsCount).toBe(0);
    });
  });
});
