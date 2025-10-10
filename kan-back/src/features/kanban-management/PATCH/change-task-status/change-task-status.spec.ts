import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChangeTaskStatusController } from './change-task-status.controller';
import { ChangeTaskStatusService } from './change-task-status.service';
import { TaskHistory } from '@/entities/task-history.entity';
import { TaskStatus } from './change-task-status.request.dto';

describe('ChangeTaskStatusController (e2e)', () => {
  let app: INestApplication;
  let taskHistoryRepository: Repository<TaskHistory>;
  let module: TestingModule;

  const mockExistingTask = {
    id: 'existing-task-history-id',
    taskId: 'test-task-id',
    taskKey: 'TASK-123',
    taskTitle: 'Test Task',
    toColumn: 'backlog',
    toStatus: 'todo',
    context: {
      priority: 'medium',
      department: 'backend',
    },
    agentId: 'test-agent',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ChangeTaskStatusController],
      providers: [
        ChangeTaskStatusService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('PATCH /kanban/tasks/:id/status', () => {
    const taskId = 'test-task-id';

    it('should successfully change status from todo to in-progress', async () => {
      // Arrange
      const statusChangeRequest = {
        newStatus: TaskStatus.IN_PROGRESS,
        statusComment: 'Начинаю работу над задачей',
        changedByEmail: 'dev@example.com',
        changedByName: 'Developer',
        context: {
          reason: 'requirements_clear',
        },
        triggerType: 'manual',
      };

      const mockCreatedStatusChange = {
        id: 'status-change-123',
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Test Task',
        action: 'status_changed',
        fromStatus: 'todo',
        toStatus: 'in-progress',
        status: 'completed',
        createdAt: new Date('2024-01-01T12:00:00Z'),
        agentId: 'test-agent',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedStatusChange,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedStatusChange,
      );

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(statusChangeRequest)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: 'Task status changed from todo to in-progress',
        taskId: taskId,
        previousStatus: 'todo',
        currentStatus: 'in-progress',
        statusChange: {
          id: 'status-change-123',
          taskId: taskId,
          fromStatus: 'todo',
          toStatus: 'in-progress',
          changedByEmail: 'dev@example.com',
          changedByName: 'Developer',
          statusComment: 'Начинаю работу над задачей',
          changedAt: mockCreatedStatusChange.createdAt,
          context: { reason: 'requirements_clear' },
          agentId: undefined,
          triggerType: 'manual',
          forceChange: undefined,
        },
        timestamp: '2024-01-01T12:00:00.000Z',
        metadata: expect.objectContaining({
          workflowValidation: 'passed',
          timeInPreviousStatus: expect.any(String),
          allowedNextStatuses: ['in-review', 'blocked', 'todo', 'cancelled'],
          queueJobId: 'status-status-change-123',
          notificationsSent: ['email'],
        }),
      });

      expect(mockTaskHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Test Task',
        action: 'status_changed',
        fromColumn: 'backlog',
        toColumn: 'backlog',
        fromStatus: 'todo',
        toStatus: 'in-progress',
        status: 'completed',
        context: expect.objectContaining({
          statusChange: expect.objectContaining({
            fromStatus: 'todo',
            toStatus: 'in-progress',
            changedByEmail: 'dev@example.com',
            changedByName: 'Developer',
            statusComment: 'Начинаю работу над задачей',
            forceChange: false,
          }),
        }),
        agentId: 'test-agent',
        agentResponse: expect.objectContaining({
          success: true,
          message: 'Status changed from todo to in-progress',
          triggerType: 'manual',
          statusTransition: 'todo -> in-progress',
          workflowValidation: 'passed',
        }),
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalledWith(
        mockCreatedStatusChange,
      );
    });

    it('should allow force status change that bypasses workflow rules', async () => {
      // Arrange
      const forceStatusRequest = {
        newStatus: TaskStatus.DONE,
        statusComment: 'Принудительное завершение',
        changedByEmail: 'admin@example.com',
        changedByName: 'Administrator',
        forceChange: true,
        triggerType: 'manual',
      };

      const mockCreatedStatusChange = {
        id: 'force-change-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedStatusChange,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedStatusChange,
      );

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(forceStatusRequest)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Task status changed from todo to done',
      );
      expect(response.body.previousStatus).toBe('todo');
      expect(response.body.currentStatus).toBe('done');
      expect(response.body.metadata.workflowValidation).toBe('bypassed');

      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.agentResponse.workflowValidation).toBe('bypassed');
    });

    it('should reject invalid status transition without force flag', async () => {
      // Arrange
      const invalidStatusRequest = {
        newStatus: TaskStatus.DONE, // Invalid transition from TODO to DONE
        statusComment: 'Trying invalid transition',
        changedByEmail: 'dev@example.com',
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(invalidStatusRequest)
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        statusCode: 400,
        message:
          "Invalid status transition from 'todo' to 'done'. Allowed transitions: in-progress, blocked, cancelled",
        error: 'Bad Request',
      });

      expect(mockTaskHistoryRepository.create).not.toHaveBeenCalled();
      expect(mockTaskHistoryRepository.save).not.toHaveBeenCalled();
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      const statusRequest = {
        newStatus: TaskStatus.IN_PROGRESS,
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(null);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/nonexistent-task/status`)
        .send(statusRequest)
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Task with ID nonexistent-task not found',
        error: 'Not Found',
      });

      expect(mockTaskHistoryRepository.create).not.toHaveBeenCalled();
      expect(mockTaskHistoryRepository.save).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid status enum', async () => {
      // Arrange
      const invalidStatusRequest = {
        newStatus: 'invalid-status',
        triggerType: 'manual',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(invalidStatusRequest)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'newStatus must be a valid enum value',
      );
      expect(mockTaskHistoryRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return 400 for missing newStatus', async () => {
      // Arrange
      const incompleteRequest = {
        statusComment: 'Missing status',
        changedByEmail: 'dev@example.com',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(incompleteRequest)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain('newStatus should not be empty');
    });

    it('should handle same status transition', async () => {
      // Arrange
      const sameStatusRequest = {
        newStatus: TaskStatus.TODO, // Same as current status
        statusComment: 'Refreshing status',
        triggerType: 'manual',
      };

      const mockCreatedStatusChange = {
        id: 'same-status-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedStatusChange,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedStatusChange,
      );

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(sameStatusRequest)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.previousStatus).toBe('todo');
      expect(response.body.currentStatus).toBe('todo');
      expect(response.body.metadata.workflowValidation).toBe('passed');
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      const statusRequest = {
        newStatus: TaskStatus.IN_PROGRESS,
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce({});
      mockTaskHistoryRepository.save.mockRejectedValueOnce(
        new Error('Database connection failed'),
      );

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(statusRequest)
        .expect(500);

      // Assert
      expect(response.body.statusCode).toBe(500);
      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should calculate time in previous status correctly', async () => {
      // Arrange
      const oldTask = {
        ...mockExistingTask,
        createdAt: new Date('2024-01-01T08:00:00Z'), // 4 hours ago from mock response
      };

      const statusRequest = {
        newStatus: TaskStatus.IN_PROGRESS,
        triggerType: 'manual',
      };

      const mockCreatedStatusChange = {
        id: 'time-calc-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(oldTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedStatusChange,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedStatusChange,
      );

      // Act
      await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(statusRequest)
        .expect(200);

      // Assert
      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context.statusChange.timeInPreviousStatus).toContain(
        'hours',
      );
    });

    it('should preserve existing task context during status change', async () => {
      // Arrange
      const existingTaskWithContext = {
        ...mockExistingTask,
        context: {
          originalPriority: 'high',
          department: 'frontend',
          customField: 'value',
        },
      };

      const statusRequest = {
        newStatus: TaskStatus.IN_PROGRESS,
        context: {
          reason: 'started_work',
          estimatedCompletion: '2024-01-15T10:00:00Z',
        },
        triggerType: 'manual',
      };

      const mockCreatedStatusChange = {
        id: 'context-change-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(
        existingTaskWithContext,
      );
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedStatusChange,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedStatusChange,
      );

      // Act
      await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}/status`)
        .send(statusRequest)
        .expect(200);

      // Assert
      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context).toEqual(
        expect.objectContaining({
          originalPriority: 'high', // Should be preserved
          department: 'frontend', // Should be preserved
          customField: 'value', // Should be preserved
          reason: 'started_work', // Should be added from request
          estimatedCompletion: '2024-01-15T10:00:00Z', // Should be added from request
          statusChange: expect.objectContaining({
            fromStatus: 'todo',
            toStatus: 'in-progress',
          }),
        }),
      );
    });
  });
});
