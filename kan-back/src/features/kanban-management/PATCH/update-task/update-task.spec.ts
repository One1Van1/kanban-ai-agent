import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTaskController } from './update-task.controller';
import { UpdateTaskService } from './update-task.service';
import { TaskHistory } from '@/entities/task-history.entity';
import { TaskPriority } from './update-task.request.dto';

describe('UpdateTaskController (e2e)', () => {
  let app: INestApplication;
  let taskHistoryRepository: Repository<TaskHistory>;
  let module: TestingModule;

  const mockExistingTask = {
    id: 'existing-task-history-id',
    taskId: 'test-task-id',
    taskKey: 'TASK-123',
    taskTitle: 'Original Task Title',
    toColumn: 'todo',
    toStatus: 'todo',
    context: {
      priority: 'medium',
      description: 'Original description',
      assignment: {
        assigneeEmail: 'original@example.com',
        assigneeName: 'Original Assignee',
      },
      tags: ['backend', 'api'],
      estimatedHours: 4,
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
      controllers: [UpdateTaskController],
      providers: [
        UpdateTaskService,
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

  describe('PATCH /kanban/tasks/:id', () => {
    const taskId = 'test-task-id';

    it('should successfully update task with multiple fields', async () => {
      // Arrange
      const updateRequest = {
        title: 'Updated Task Title',
        priority: TaskPriority.HIGH,
        assigneeEmail: 'new.assignee@example.com',
        assigneeName: 'New Assignee',
        description: 'Updated description with new requirements',
        estimatedHours: 8,
        updateReason: 'Client feedback implementation',
        updatedByEmail: 'manager@example.com',
        updatedByName: 'Project Manager',
        triggerType: 'manual',
      };

      const mockCreatedUpdate = {
        id: 'update-history-123',
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Updated Task Title',
        action: 'task_updated',
        toColumn: 'todo',
        toStatus: 'todo',
        status: 'completed',
        createdAt: new Date('2024-01-01T12:00:00Z'),
        agentId: 'test-agent',
        context: {
          ...mockExistingTask.context,
          priority: 'high',
          description: 'Updated description with new requirements',
          assignment: {
            assigneeEmail: 'new.assignee@example.com',
            assigneeName: 'New Assignee',
            lastUpdated: '2024-01-01T12:00:00.000Z',
            updatedBy: 'manager@example.com',
          },
          estimatedHours: 8,
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(mockCreatedUpdate);
      mockTaskHistoryRepository.save.mockResolvedValueOnce(mockCreatedUpdate);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(updateRequest)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: expect.stringContaining('Task updated successfully'),
        taskId: taskId,
        updatedTask: {
          id: 'update-history-123',
          taskId: taskId,
          taskKey: 'TASK-123',
          title: 'Updated Task Title',
          description: 'Updated description with new requirements',
          priority: 'high',
          assigneeEmail: 'new.assignee@example.com',
          assigneeName: 'New Assignee',
          tags: ['backend', 'api'],
          dueDate: undefined,
          estimatedHours: 8,
          currentColumn: 'todo',
          currentStatus: 'todo',
          context: expect.objectContaining({
            priority: 'high',
            description: 'Updated description with new requirements',
            estimatedHours: 8,
          }),
          updatedAt: mockCreatedUpdate.createdAt,
          updatedBy: 'manager@example.com',
          agentId: undefined,
        },
        changes: expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            oldValue: 'Original Task Title',
            newValue: 'Updated Task Title',
          }),
          expect.objectContaining({
            field: 'priority',
            oldValue: 'medium',
            newValue: 'high',
          }),
          expect.objectContaining({
            field: 'assigneeEmail',
            oldValue: 'original@example.com',
            newValue: 'new.assignee@example.com',
          }),
        ]),
        timestamp: '2024-01-01T12:00:00.000Z',
        metadata: expect.objectContaining({
          changesCount: expect.any(Number),
          preservedPosition: true,
          validationsPassed: expect.arrayContaining([
            'task_exists',
            'changes_detected',
          ]),
        }),
      });

      expect(mockTaskHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Updated Task Title',
        action: 'task_updated',
        fromColumn: 'todo',
        toColumn: 'todo',
        fromStatus: 'todo',
        toStatus: 'todo',
        status: 'completed',
        context: expect.objectContaining({
          priority: 'high',
          description: 'Updated description with new requirements',
          estimatedHours: 8,
          assignment: expect.objectContaining({
            assigneeEmail: 'new.assignee@example.com',
            assigneeName: 'New Assignee',
          }),
        }),
        agentId: 'test-agent',
        agentResponse: expect.objectContaining({
          success: true,
          triggerType: 'manual',
          preservedPosition: true,
        }),
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalledWith(
        mockCreatedUpdate,
      );
    });

    it('should handle minimal update with single field', async () => {
      // Arrange
      const minimalUpdate = {
        priority: TaskPriority.URGENT,
        triggerType: 'manual',
      };

      const mockCreatedUpdate = {
        id: 'minimal-update-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
        toColumn: 'todo',
        toStatus: 'todo',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(mockCreatedUpdate);
      mockTaskHistoryRepository.save.mockResolvedValueOnce(mockCreatedUpdate);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(minimalUpdate)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.changes).toEqual([
        expect.objectContaining({
          field: 'priority',
          oldValue: 'medium',
          newValue: 'urgent',
        }),
      ]);
      expect(response.body.metadata.changesCount).toBe(1);
    });

    it('should return no changes when update values match current values', async () => {
      // Arrange
      const noChangeUpdate = {
        title: 'Original Task Title', // Same as existing
        priority: TaskPriority.MEDIUM, // Same as existing
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(noChangeUpdate)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: 'No changes detected - task is already up to date',
        taskId: taskId,
        updatedTask: expect.objectContaining({
          title: 'Original Task Title',
          priority: 'medium',
          currentColumn: 'todo',
          currentStatus: 'todo',
        }),
        changes: [],
        timestamp: expect.any(String),
        metadata: {
          changesCount: 0,
          preservedPosition: true,
          validationsPassed: ['no_changes_detected'],
        },
      });

      expect(mockTaskHistoryRepository.create).not.toHaveBeenCalled();
      expect(mockTaskHistoryRepository.save).not.toHaveBeenCalled();
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      const updateRequest = {
        title: 'New Title',
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(null);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/nonexistent-task`)
        .send(updateRequest)
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

    it('should return 400 for invalid priority enum', async () => {
      // Arrange
      const invalidUpdate = {
        priority: 'invalid-priority',
        triggerType: 'manual',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(invalidUpdate)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'priority must be a valid enum value',
      );
      expect(mockTaskHistoryRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      // Arrange
      const invalidUpdate = {
        assigneeEmail: 'invalid-email-format',
        triggerType: 'manual',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(invalidUpdate)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'assigneeEmail must be a valid email',
      );
    });

    it('should return 400 for title too long', async () => {
      // Arrange
      const invalidUpdate = {
        title: 'a'.repeat(501), // Exceeds 500 character limit
        triggerType: 'manual',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(invalidUpdate)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'title must be shorter than or equal to 500 characters',
      );
    });

    it('should handle complex context updates', async () => {
      // Arrange
      const complexUpdate = {
        title: 'Complex Updated Task',
        tags: ['security', 'critical', 'hotfix'],
        dueDate: '2024-02-15T10:00:00Z',
        context: {
          department: 'security',
          securityLevel: 'high',
          clientId: 'enterprise-123',
          customFields: {
            requiresApproval: true,
            escalationLevel: 2,
          },
        },
        updateReason: 'Security escalation',
        agentId: 'security-agent-456',
        triggerType: 'agent_instruction',
      };

      const mockCreatedUpdate = {
        id: 'complex-update-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
        toColumn: 'todo',
        toStatus: 'todo',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(mockCreatedUpdate);
      mockTaskHistoryRepository.save.mockResolvedValueOnce(mockCreatedUpdate);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(complexUpdate)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title' }),
          expect.objectContaining({ field: 'tags' }),
          expect.objectContaining({ field: 'dueDate' }),
        ]),
      );

      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context).toEqual(
        expect.objectContaining({
          department: 'security',
          securityLevel: 'high',
          clientId: 'enterprise-123',
          tags: ['security', 'critical', 'hotfix'],
          dueDate: '2024-02-15T10:00:00Z',
        }),
      );
      expect(createCall.agentId).toBe('security-agent-456');
    });

    it('should preserve existing context when partially updating', async () => {
      // Arrange
      const partialUpdate = {
        priority: TaskPriority.HIGH,
        estimatedHours: 12,
        triggerType: 'manual',
      };

      const mockCreatedUpdate = {
        id: 'partial-update-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
        toColumn: 'todo',
        toStatus: 'todo',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(mockCreatedUpdate);
      mockTaskHistoryRepository.save.mockResolvedValueOnce(mockCreatedUpdate);

      // Act
      await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(partialUpdate)
        .expect(200);

      // Assert
      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context).toEqual(
        expect.objectContaining({
          // Should preserve existing values
          description: 'Original description',
          tags: ['backend', 'api'],
          assignment: expect.objectContaining({
            assigneeEmail: 'original@example.com',
          }),
          // Should update new values
          priority: 'high',
          estimatedHours: 12,
        }),
      );
    });

    it('should handle assignment updates correctly', async () => {
      // Arrange
      const assignmentUpdate = {
        assigneeEmail: 'specialist@example.com',
        assigneeName: 'Specialist Developer',
        updatedByEmail: 'lead@example.com',
        triggerType: 'manual',
      };

      const mockCreatedUpdate = {
        id: 'assignment-update-123',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
        toColumn: 'todo',
        toStatus: 'todo',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(mockCreatedUpdate);
      mockTaskHistoryRepository.save.mockResolvedValueOnce(mockCreatedUpdate);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(assignmentUpdate)
        .expect(200);

      // Assert
      expect(response.body.changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'assigneeEmail',
            oldValue: 'original@example.com',
            newValue: 'specialist@example.com',
          }),
          expect.objectContaining({
            field: 'assigneeName',
            oldValue: 'Original Assignee',
            newValue: 'Specialist Developer',
          }),
        ]),
      );

      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context.assignment).toEqual(
        expect.objectContaining({
          assigneeEmail: 'specialist@example.com',
          assigneeName: 'Specialist Developer',
          lastUpdated: expect.any(String),
          updatedBy: 'lead@example.com',
        }),
      );
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      const updateRequest = {
        title: 'Updated Title',
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce({});
      mockTaskHistoryRepository.save.mockRejectedValueOnce(
        new Error('Database connection failed'),
      );

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(updateRequest)
        .expect(500);

      // Assert
      expect(response.body.statusCode).toBe(500);
      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should handle empty update request', async () => {
      // Arrange
      const emptyUpdate = {
        triggerType: 'manual',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/kanban/tasks/${taskId}`)
        .send(emptyUpdate)
        .expect(200);

      // Assert
      expect(response.body.message).toBe(
        'No changes detected - task is already up to date',
      );
      expect(response.body.changes).toEqual([]);
      expect(response.body.metadata.changesCount).toBe(0);
    });
  });
});
