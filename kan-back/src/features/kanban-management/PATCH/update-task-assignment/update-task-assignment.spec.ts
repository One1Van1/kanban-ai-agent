import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaskAssignmentController } from './update-task-assignment.controller';
import { UpdateTaskAssignmentService } from './update-task-assignment.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  UpdateTaskAssignmentRequestDto,
  AssignmentAction,
} from './update-task-assignment.request.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UpdateTaskAssignmentController', () => {
  let controller: UpdateTaskAssignmentController;
  let service: UpdateTaskAssignmentService;
  let repository: Repository<TaskHistory>;

  const mockRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateTaskAssignmentController],
      providers: [
        UpdateTaskAssignmentService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<UpdateTaskAssignmentController>(
      UpdateTaskAssignmentController,
    );
    service = module.get<UpdateTaskAssignmentService>(
      UpdateTaskAssignmentService,
    );
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAssignment', () => {
    const taskId = 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a';

    const mockCurrentTask = {
      id: 'history-1',
      agentId: 'agent-001',
      taskId,
      taskKey: 'TASK-123',
      taskTitle: 'Test Task',
      action: 'created',
      status: 'in_progress',
      toColumn: 'In Progress',
      context: {
        assignmentData: {
          assignee: 'agent-001',
          watchers: ['agent-003'],
          assignmentPriority: 'normal',
        },
      },
      agentResponse: {},
      createdAt: new Date('2024-01-15T09:00:00Z'),
    } as Partial<TaskHistory>;

    it('should reassign task successfully', async () => {
      const reassignRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.REASSIGN,
        assignee: 'agent-002',
        assignmentReason: 'Better expertise match',
        notifyAssignees: true,
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-assignment-1',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(1); // Assignment version
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(taskId, reassignRequest);

      expect(result).toEqual({
        taskId,
        action: AssignmentAction.REASSIGN,
        assignee: 'agent-002',
        previousAssignee: 'agent-001',
        watchers: ['agent-003'],
        assignmentDetails: undefined,
        updatedBy: 'agent-001',
        updatedAt: expect.any(Date),
        assignmentReason: 'Better expertise match',
        watchersAdded: [],
        watchersRemoved: [],
        notificationsSent: true,
        assignmentPriority: 'normal',
        success: true,
        assignmentVersion: 2,
        historyLogId: 'history-assignment-1',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should add watchers successfully', async () => {
      const addWatcherRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.ADD_WATCHER,
        watchers: ['agent-003', 'agent-004', 'agent-005'],
        assignmentReason: 'Adding stakeholders',
        notifyAssignees: true,
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-watcher-add',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(
        taskId,
        addWatcherRequest,
      );

      expect(result.watchers).toEqual(['agent-003', 'agent-004', 'agent-005']);
      expect(result.watchersAdded).toEqual(['agent-004', 'agent-005']);
      expect(result.watchersRemoved).toEqual([]);
    });

    it('should unassign task successfully', async () => {
      const unassignRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.UNASSIGN,
        assignmentReason: 'Task on hold',
        notifyAssignees: true,
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-unassign',
        createdAt: new Date('2024-01-15T12:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(taskId, unassignRequest);

      expect(result.assignee).toBeUndefined();
      expect(result.previousAssignee).toBe('agent-001');
      expect(result.action).toBe(AssignmentAction.UNASSIGN);
    });

    it('should throw NotFoundException for non-existent task', async () => {
      const request: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.ASSIGN,
        assignee: 'agent-002',
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        controller.updateAssignment(taskId, request),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid assignment action', async () => {
      const invalidRequest = {
        action: 'invalid-action' as AssignmentAction,
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateAssignment(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when assignee missing for assign action', async () => {
      const invalidRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.ASSIGN,
        // Missing assignee
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateAssignment(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle detailed assignment with roles and dates', async () => {
      const detailedRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.ASSIGN,
        assignee: 'agent-002',
        watchers: ['agent-003', 'agent-004'],
        assignmentDetails: [
          {
            userId: 'agent-002',
            role: 'primary_assignee',
            startDate: '2024-01-15T09:00:00Z',
            endDate: '2024-01-20T17:00:00Z',
          },
          {
            userId: 'agent-003',
            role: 'reviewer',
            startDate: '2024-01-19T09:00:00Z',
            endDate: '2024-01-20T17:00:00Z',
          },
        ],
        assignmentPriority: 'high',
        assignmentReason: 'Critical feature',
        notifyAssignees: true,
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-detailed',
        createdAt: new Date('2024-01-15T13:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(taskId, detailedRequest);

      expect(result.assignmentDetails).toHaveLength(2);
      expect(result.assignmentDetails?.[0].role).toBe('primary_assignee');
      expect(result.assignmentPriority).toBe('high');
    });

    it('should validate date ranges in assignment details', async () => {
      const invalidDateRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.ASSIGN,
        assignee: 'agent-002',
        assignmentDetails: [
          {
            userId: 'agent-002',
            role: 'primary_assignee',
            startDate: '2024-01-20T17:00:00Z',
            endDate: '2024-01-15T09:00:00Z', // End before start
          },
        ],
        updatedBy: 'agent-001',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.updateAssignment(taskId, invalidDateRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle watcher removal correctly', async () => {
      const removeWatcherRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.REMOVE_WATCHER,
        watchers: [], // Remove all watchers
        assignmentReason: 'Reducing notification noise',
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-watcher-remove',
        createdAt: new Date('2024-01-15T14:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(
        taskId,
        removeWatcherRequest,
      );

      expect(result.watchers).toEqual([]);
      expect(result.watchersRemoved).toEqual(['agent-003']);
      expect(result.watchersAdded).toEqual([]);
    });

    it('should handle assignment priority updates', async () => {
      const priorityRequest: UpdateTaskAssignmentRequestDto = {
        action: AssignmentAction.REASSIGN,
        assignee: 'agent-002',
        assignmentPriority: 'urgent',
        assignmentReason: 'Escalated to urgent priority',
        updatedBy: 'agent-001',
      };

      const mockSavedLog = {
        id: 'history-priority',
        createdAt: new Date('2024-01-15T15:00:00Z'),
      } as TaskHistory;

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.updateAssignment(taskId, priorityRequest);

      expect(result.assignmentPriority).toBe('urgent');
      expect(result.assignee).toBe('agent-002');
    });
  });
});
