import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteTaskController } from './delete-task.controller';
import { DeleteTaskService } from './delete-task.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DeleteTaskRequestDto, DeleteMode } from './delete-task.request.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('DeleteTaskController', () => {
  let controller: DeleteTaskController;
  let service: DeleteTaskService;
  let repository: Repository<TaskHistory>;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteTaskController],
      providers: [
        DeleteTaskService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<DeleteTaskController>(DeleteTaskController);
    service = module.get<DeleteTaskService>(DeleteTaskService);
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteTask', () => {
    const taskId = 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a';

    const mockCurrentTask = {
      id: 'history-1',
      agentId: 'agent-001',
      taskId,
      taskKey: 'TASK-123',
      taskTitle: 'Test Task for Deletion',
      action: 'created',
      status: 'in_progress',
      toColumn: 'In Progress',
      context: {
        taskData: {
          title: 'Test Task for Deletion',
          priority: 'medium',
        },
        assignmentData: {
          assignee: 'agent-002',
          watchers: ['agent-003', 'agent-004'],
        },
      },
      agentResponse: {},
      createdAt: new Date('2024-01-15T09:00:00Z'),
    } as Partial<TaskHistory>;

    it('should soft delete task successfully', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.SOFT_DELETE,
        deletedBy: 'agent-001',
        deleteReason: 'Task no longer relevant',
        forceDelete: false,
        deleteRelatedData: true,
        notifyUsers: true,
      };

      const mockSavedLog = {
        id: 'history-delete-1',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue([]); // No related tasks
      mockRepository.count.mockResolvedValue(15); // History entries
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result).toEqual({
        taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Test Task for Deletion',
        deleteMode: DeleteMode.SOFT_DELETE,
        deletedBy: 'agent-001',
        deletedAt: expect.any(Date),
        deleteReason: 'Task no longer relevant',
        originalStatus: 'in_progress',
        originalColumn: 'In Progress',
        assignee: 'agent-002',
        watchers: ['agent-003', 'agent-004'],
        relatedTasks: [],
        attachmentsDeleted: 0,
        commentsDeleted: 0,
        historyEntriesArchived: 15,
        notifiedUsers: ['agent-002', 'agent-003', 'agent-004'],
        success: true,
        canBeRestored: true,
        restorationDeadline: expect.any(Date),
        historyLogId: 'history-delete-1',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should hard delete task with related data', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.HARD_DELETE,
        deletedBy: 'agent-001',
        deleteReason: 'Permanent cleanup',
        forceDelete: true,
        deleteRelatedData: true,
        notifyUsers: false,
      };

      const mockSavedLog = {
        id: 'history-hard-delete',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(20);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result.deleteMode).toBe(DeleteMode.HARD_DELETE);
      expect(result.canBeRestored).toBe(false);
      expect(result.restorationDeadline).toBeUndefined();
      expect(result.notifiedUsers).toEqual([]);
    });

    it('should archive task successfully', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.ARCHIVE,
        deletedBy: 'agent-001',
        deleteReason: 'Archiving old completed task',
        forceDelete: false,
        deleteRelatedData: false,
        notifyUsers: true,
      };

      const mockSavedLog = {
        id: 'history-archive',
        createdAt: new Date('2024-01-15T12:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(12);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result.deleteMode).toBe(DeleteMode.ARCHIVE);
      expect(result.canBeRestored).toBe(true);
      expect(result.attachmentsDeleted).toBe(0); // Not deleted in archive mode
      expect(result.commentsDeleted).toBe(0);
    });

    it('should throw NotFoundException for non-existent task', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deletedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        controller.deleteTask(taskId, deleteRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for already deleted task', async () => {
      const alreadyDeletedTask = {
        ...mockCurrentTask,
        status: 'deleted',
      };

      const deleteRequest: DeleteTaskRequestDto = {
        deletedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(alreadyDeletedTask);

      await expect(
        controller.deleteTask(taskId, deleteRequest),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when task has dependencies without force', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deletedBy: 'agent-001',
        forceDelete: false,
      };

      // Mock dependent tasks
      const dependentTasks = [
        {
          taskId: 'dependent-1',
          context: {
            linkData: {
              sourceTaskId: taskId,
              targetTaskId: 'dependent-1',
              linkType: 'blocks',
            },
          },
        },
      ];

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue(dependentTasks);

      await expect(
        controller.deleteTask(taskId, deleteRequest),
      ).rejects.toThrow(ConflictException);
    });

    it('should force delete task with dependencies when force flag is set', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.HARD_DELETE,
        deletedBy: 'agent-001',
        forceDelete: true,
        deleteRelatedData: true,
        notifyUsers: false,
      };

      const dependentTasks = [
        {
          taskId: 'dependent-1',
          context: {
            linkData: {
              sourceTaskId: taskId,
              targetTaskId: 'dependent-1',
              linkType: 'blocks',
            },
          },
        },
      ];

      const mockSavedLog = {
        id: 'history-force-delete',
        createdAt: new Date('2024-01-15T13:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue(dependentTasks);
      mockRepository.count.mockResolvedValue(25);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result.success).toBe(true);
      expect(result.deleteMode).toBe(DeleteMode.HARD_DELETE);
    });

    it('should throw BadRequestException for invalid delete mode', async () => {
      const invalidRequest = {
        deleteMode: 'invalid-mode' as DeleteMode,
        deletedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.deleteTask(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when hard deleting completed task without force', async () => {
      const completedTask = {
        ...mockCurrentTask,
        status: 'done',
      };

      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.HARD_DELETE,
        deletedBy: 'agent-001',
        forceDelete: false,
      };

      mockRepository.findOne.mockResolvedValue(completedTask);

      await expect(
        controller.deleteTask(taskId, deleteRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle task with related tasks and links', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.SOFT_DELETE,
        deletedBy: 'agent-001',
        deleteReason: 'Cleaning up related tasks',
        forceDelete: false,
        deleteRelatedData: false,
        notifyUsers: true,
      };

      const relatedTasks = [
        {
          taskId: 'link-1',
          context: {
            linkData: {
              sourceTaskId: taskId,
              targetTaskId: 'related-1',
              linkType: 'relates_to',
            },
          },
        },
        {
          taskId: 'link-2',
          context: {
            linkData: {
              sourceTaskId: 'related-2',
              targetTaskId: taskId,
              linkType: 'relates_to',
            },
          },
        },
      ];

      const mockSavedLog = {
        id: 'history-with-relations',
        createdAt: new Date('2024-01-15T14:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue(relatedTasks);
      mockRepository.count.mockResolvedValue(18);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result.relatedTasks).toEqual(['related-1', 'related-2']);
      expect(result.success).toBe(true);
    });

    it('should calculate correct restoration deadline for soft delete', async () => {
      const deleteRequest: DeleteTaskRequestDto = {
        deleteMode: DeleteMode.SOFT_DELETE,
        deletedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-restoration',
        createdAt: new Date('2024-01-15T15:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(10);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.deleteTask(taskId, deleteRequest);

      expect(result.canBeRestored).toBe(true);
      expect(result.restorationDeadline).toBeDefined();

      // Check that restoration deadline is approximately 30 days from now
      const expectedDeadline = new Date();
      expectedDeadline.setDate(expectedDeadline.getDate() + 30);
      const actualDeadline = new Date(result.restorationDeadline!);

      expect(
        Math.abs(actualDeadline.getTime() - expectedDeadline.getTime()),
      ).toBeLessThan(60000); // Within 1 minute
    });
  });
});
