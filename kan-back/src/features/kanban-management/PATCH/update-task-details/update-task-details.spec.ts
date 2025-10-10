import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaskDetailsController } from './update-task-details.controller';
import { UpdateTaskDetailsService } from './update-task-details.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  UpdateTaskDetailsRequestDto,
  TaskPriority,
  TaskType,
} from './update-task-details.request.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UpdateTaskDetailsController', () => {
  let controller: UpdateTaskDetailsController;
  let service: UpdateTaskDetailsService;
  let repository: Repository<TaskHistory>;

  const mockRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateTaskDetailsController],
      providers: [
        UpdateTaskDetailsService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<UpdateTaskDetailsController>(
      UpdateTaskDetailsController,
    );
    service = module.get<UpdateTaskDetailsService>(UpdateTaskDetailsService);
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateDetails', () => {
    const taskId = 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a';

    const mockCurrentTask = {
      id: 'history-1',
      agentId: 'agent-001',
      taskId,
      taskKey: 'TASK-123',
      taskTitle: 'Original Task Title',
      action: 'created',
      status: 'todo',
      toColumn: 'To Do',
      context: {
        taskData: {
          title: 'Original Task Title',
          description: 'Original description',
          priority: TaskPriority.MEDIUM,
          type: TaskType.TASK,
          assignee: 'agent-001',
          labels: ['backend'],
          estimatedHours: 4,
          storyPoints: 3,
        },
      },
      agentResponse: {},
      createdAt: new Date('2024-01-15T09:00:00Z'),
    } as Partial<TaskHistory>;

    const mockRequest: UpdateTaskDetailsRequestDto = {
      title: 'Updated Task Title',
      priority: TaskPriority.HIGH,
      assignee: 'agent-002',
      labels: ['backend', 'urgent'],
      estimatedHours: 8,
      updatedBy: 'agent-001',
      updateComment: 'Updated priority and assignee',
    };

    it('should update task details successfully', async () => {
      const mockSavedLog = {
        id: 'history-update-1',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(2); // Version count
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateDetails(taskId, mockRequest);

      expect(result).toEqual({
        taskId,
        title: 'Updated Task Title',
        description: 'Original description',
        priority: TaskPriority.HIGH,
        type: TaskType.TASK,
        assignee: 'agent-002',
        reporter: undefined,
        labels: ['backend', 'urgent'],
        estimatedHours: 8,
        storyPoints: 3,
        dueDate: undefined,
        customFields: undefined,
        updatedBy: 'agent-001',
        updatedAt: expect.any(Date),
        fieldsUpdated: [
          'title',
          'priority',
          'assignee',
          'labels',
          'estimatedHours',
        ],
        previousValues: {
          title: 'Original Task Title',
          priority: TaskPriority.MEDIUM,
          assignee: 'agent-001',
          labels: ['backend'],
          estimatedHours: 4,
        },
        updateComment: 'Updated priority and assignee',
        success: true,
        version: 3,
        historyLogId: 'history-update-1',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        controller.updateDetails(taskId, mockRequest),
      ).rejects.toThrow(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw BadRequestException when no fields to update', async () => {
      const emptyRequest: UpdateTaskDetailsRequestDto = {
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateDetails(taskId, emptyRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate priority enum', async () => {
      const invalidRequest = {
        ...mockRequest,
        priority: 'invalid-priority' as TaskPriority,
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateDetails(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate task type enum', async () => {
      const invalidRequest = {
        ...mockRequest,
        type: 'invalid-type' as TaskType,
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateDetails(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle custom fields update', async () => {
      const customFieldsRequest: UpdateTaskDetailsRequestDto = {
        customFields: [
          { name: 'Sprint', value: 'Sprint 24.2' },
          { name: 'Component', value: 'Authentication' },
        ],
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-custom-fields',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(1);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateDetails(
        taskId,
        customFieldsRequest,
      );

      expect(result.customFields).toEqual([
        { name: 'Sprint', value: 'Sprint 24.2' },
        { name: 'Component', value: 'Authentication' },
      ]);
      expect(result.fieldsUpdated).toContain('customFields');
    });

    it('should handle partial updates correctly', async () => {
      const partialRequest: UpdateTaskDetailsRequestDto = {
        description: 'Updated description only',
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-partial',
        createdAt: new Date('2024-01-15T12:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateDetails(taskId, partialRequest);

      expect(result.description).toBe('Updated description only');
      expect(result.title).toBe('Original Task Title'); // Unchanged
      expect(result.priority).toBe(TaskPriority.MEDIUM); // Unchanged
      expect(result.fieldsUpdated).toEqual(['description']);
    });

    it('should validate negative estimated hours', async () => {
      const invalidRequest = {
        ...mockRequest,
        estimatedHours: -5,
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateDetails(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate invalid due date format', async () => {
      const invalidRequest = {
        ...mockRequest,
        dueDate: 'invalid-date',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateDetails(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle due date update correctly', async () => {
      const dueDateRequest: UpdateTaskDetailsRequestDto = {
        dueDate: '2024-01-25T23:59:59Z',
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-due-date',
        createdAt: new Date('2024-01-15T13:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateDetails(taskId, dueDateRequest);

      expect(result.dueDate).toBe('2024-01-25T23:59:59Z');
      expect(result.fieldsUpdated).toContain('dueDate');
    });
  });
});
