import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignTaskController } from './assign-task.controller';
import { AssignTaskService } from './assign-task.service';
import { TaskHistory } from '../../../../entities/task-history.entity';

describe('AssignTaskController (e2e)', () => {
  let app: INestApplication;
  let taskHistoryRepository: Repository<TaskHistory>;
  let module: TestingModule;

  const mockExistingTask = {
    id: 'existing-task-history-id',
    taskId: 'test-task-id',
    taskKey: 'TASK-123',
    taskTitle: 'Test Task',
    toColumn: 'in-progress',
    toStatus: 'active',
    context: {
      priority: 'medium',
      assignment: {
        assigneeEmail: 'old.user@example.com',
      },
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
      controllers: [AssignTaskController],
      providers: [
        AssignTaskService,
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

  describe('POST /kanban/tasks/:id/assign', () => {
    const taskId = 'test-task-id';
    const assignmentRequest = {
      assigneeEmail: 'john.doe@example.com',
      assigneeName: 'John Doe',
      assignedByEmail: 'manager@example.com',
      assignedByName: 'Project Manager',
      assignmentMessage: 'Назначаю тебе эту задачу',
      context: {
        priority: 'high',
        department: 'backend',
      },
      agentId: 'test-agent-123',
      triggerType: 'agent_instruction',
    };

    it('should successfully assign task', async () => {
      // Arrange
      const mockCreatedAssignment = {
        id: 'new-assignment-id',
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Test Task',
        action: 'task_assigned',
        status: 'completed',
        createdAt: new Date('2024-01-01T12:00:00Z'),
        agentId: 'test-agent-123',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedAssignment,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedAssignment,
      );

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(assignmentRequest)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: 'Task successfully assigned to john.doe@example.com',
        taskId: taskId,
        assignment: {
          id: 'new-assignment-id',
          taskId: taskId,
          assigneeEmail: 'john.doe@example.com',
          assigneeName: 'John Doe',
          assignedByEmail: 'manager@example.com',
          assignedByName: 'Project Manager',
          assignmentMessage: 'Назначаю тебе эту задачу',
          assignedAt: mockCreatedAssignment.createdAt,
          context: {
            priority: 'high',
            department: 'backend',
          },
          agentId: 'test-agent-123',
          triggerType: 'agent_instruction',
        },
        timestamp: '2024-01-01T12:00:00.000Z',
        metadata: {
          previousAssignee: 'old.user@example.com',
          queueJobId: 'assign-new-assignment-id',
          notificationsSent: ['email'],
        },
      });

      expect(mockTaskHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        taskId: taskId,
        taskKey: 'TASK-123',
        taskTitle: 'Test Task',
        action: 'task_assigned',
        fromColumn: 'in-progress',
        toColumn: 'in-progress',
        fromStatus: 'active',
        toStatus: 'active',
        status: 'completed',
        context: expect.objectContaining({
          assignment: expect.objectContaining({
            assigneeEmail: 'john.doe@example.com',
            assigneeName: 'John Doe',
            assignedByEmail: 'manager@example.com',
            assignedByName: 'Project Manager',
            assignmentMessage: 'Назначаю тебе эту задачу',
            previousAssignee: 'old.user@example.com',
          }),
        }),
        agentId: 'test-agent-123',
        agentResponse: expect.objectContaining({
          success: true,
          message: 'Task assigned to john.doe@example.com',
          triggerType: 'agent_instruction',
          assigneeEmail: 'john.doe@example.com',
          assigneeName: 'John Doe',
        }),
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalledWith(
        mockCreatedAssignment,
      );
    });

    it('should handle minimal assignment request', async () => {
      // Arrange
      const minimalRequest = {
        assigneeEmail: 'simple@example.com',
      };

      const mockCreatedAssignment = {
        id: 'minimal-assignment-id',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedAssignment,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedAssignment,
      );

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(minimalRequest)
        .expect(201);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.assignment.assigneeEmail).toBe('simple@example.com');
      expect(response.body.assignment.assigneeName).toBeUndefined();
      expect(response.body.assignment.assignmentMessage).toBeUndefined();
    });

    it('should return 404 when task not found', async () => {
      // Arrange
      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(null);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/nonexistent-task/assign`)
        .send(assignmentRequest)
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

    it('should return 400 for invalid assignee email', async () => {
      // Arrange
      const invalidRequest = {
        assigneeEmail: 'invalid-email',
        assigneeName: 'Test User',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(invalidRequest)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'assigneeEmail must be a valid email',
      );
      expect(mockTaskHistoryRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return 400 for empty assignee email', async () => {
      // Arrange
      const emptyRequest = {
        assigneeEmail: '',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(emptyRequest)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'assigneeEmail should not be empty',
      );
    });

    it('should return 400 for missing assignee email', async () => {
      // Arrange
      const incompleteRequest = {
        assigneeName: 'Test User',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(incompleteRequest)
        .expect(400);

      // Assert
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'assigneeEmail should not be empty',
      );
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(mockExistingTask);
      mockTaskHistoryRepository.create.mockReturnValueOnce({});
      mockTaskHistoryRepository.save.mockRejectedValueOnce(
        new Error('Database connection failed'),
      );

      // Act
      const response = await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(assignmentRequest)
        .expect(500);

      // Assert
      expect(response.body.statusCode).toBe(500);
      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should preserve existing task context during assignment', async () => {
      // Arrange
      const existingTaskWithContext = {
        ...mockExistingTask,
        context: {
          originalPriority: 'low',
          department: 'frontend',
          customField: 'value',
          assignment: {
            assigneeEmail: 'previous@example.com',
          },
        },
      };

      const mockCreatedAssignment = {
        id: 'context-assignment-id',
        taskId: taskId,
        createdAt: new Date('2024-01-01T12:00:00Z'),
      };

      mockTaskHistoryRepository.findOne.mockResolvedValueOnce(
        existingTaskWithContext,
      );
      mockTaskHistoryRepository.create.mockReturnValueOnce(
        mockCreatedAssignment,
      );
      mockTaskHistoryRepository.save.mockResolvedValueOnce(
        mockCreatedAssignment,
      );

      // Act
      await request(app.getHttpServer())
        .post(`/kanban/tasks/${taskId}/assign`)
        .send(assignmentRequest)
        .expect(201);

      // Assert
      const createCall = mockTaskHistoryRepository.create.mock.calls[0][0];
      expect(createCall.context).toEqual(
        expect.objectContaining({
          originalPriority: 'low',
          department: 'backend', // Should be overwritten by request
          customField: 'value', // Should be preserved
          priority: 'high', // Should be added from request
          assignment: expect.objectContaining({
            assigneeEmail: 'john.doe@example.com',
            previousAssignee: 'previous@example.com',
          }),
        }),
      );
    });
  });
});
