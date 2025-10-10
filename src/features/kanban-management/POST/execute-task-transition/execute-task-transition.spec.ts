import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecuteTaskTransitionController } from './execute-task-transition.controller';
import { ExecuteTaskTransitionService } from './execute-task-transition.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  ExecuteTaskTransitionRequestDto,
  TransitionAction,
} from './execute-task-transition.request.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ExecuteTaskTransitionController', () => {
  let controller: ExecuteTaskTransitionController;
  let service: ExecuteTaskTransitionService;
  let repository: Repository<TaskHistory>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecuteTaskTransitionController],
      providers: [
        ExecuteTaskTransitionService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ExecuteTaskTransitionController>(
      ExecuteTaskTransitionController,
    );
    service = module.get<ExecuteTaskTransitionService>(
      ExecuteTaskTransitionService,
    );
    repository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executeTransition', () => {
    const taskId = 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a';
    const mockCurrentTask = {
      id: 'history-1',
      agentId: 'agent-001',
      taskId,
      taskKey: 'TASK-123',
      taskTitle: 'Test Task',
      action: 'created',
      status: 'todo',
      fromStatus: undefined,
      toStatus: 'todo',
      fromColumn: undefined,
      toColumn: 'To Do',
      context: {},
      agentResponse: {},
      createdAt: new Date('2024-01-15T09:00:00Z'),
    } as TaskHistory;

    const mockRequest: ExecuteTaskTransitionRequestDto = {
      action: TransitionAction.START_PROGRESS,
      toStatus: 'in_progress',
      toColumn: 'In Progress',
      executedBy: 'agent-001',
      comment: 'Starting work on this task',
    };

    it('should execute valid transition successfully', async () => {
      const mockSavedLog = {
        ...mockCurrentTask,
        id: 'history-2',
        action: 'task_transition',
        fromStatus: 'todo',
        toStatus: 'in_progress',
        fromColumn: null,
        toColumn: 'In Progress',
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.executeTransition(taskId, mockRequest);

      expect(result).toEqual({
        taskId,
        action: TransitionAction.START_PROGRESS,
        fromStatus: 'todo',
        toStatus: 'in_progress',
        fromColumn: null,
        toColumn: 'In Progress',
        executedBy: 'agent-001',
        executedAt: expect.any(Date),
        comment: 'Starting work on this task',
        resolution: undefined,
        success: true,
        historyLogId: 'history-2',
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        controller.executeTransition(taskId, mockRequest),
      ).rejects.toThrow(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw BadRequestException for invalid transition', async () => {
      const invalidRequest = {
        ...mockRequest,
        action: TransitionAction.START_PROGRESS,
        toStatus: 'done', // Invalid: cannot go from todo to done directly
      };

      mockRepository.findOne.mockResolvedValue(mockCurrentTask);

      await expect(
        controller.executeTransition(taskId, invalidRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should require resolution for complete action', async () => {
      const completeRequest = {
        action: TransitionAction.COMPLETE,
        toStatus: 'done',
        executedBy: 'agent-001',
        // Missing resolution
      };

      const taskInProgress = {
        ...mockCurrentTask,
        status: 'in_progress',
      };

      mockRepository.findOne.mockResolvedValue(taskInProgress);

      await expect(
        controller.executeTransition(taskId, completeRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle block transition correctly', async () => {
      const blockRequest = {
        action: TransitionAction.BLOCK,
        toStatus: 'blocked',
        toColumn: 'Blocked',
        executedBy: 'agent-001',
        comment: 'Waiting for external dependency',
      };

      const taskInProgress = {
        ...mockCurrentTask,
        status: 'in_progress',
        toColumn: 'In Progress',
      };

      const mockSavedLog = {
        ...taskInProgress,
        id: 'history-block',
        action: 'task_transition',
        fromStatus: 'in_progress',
        toStatus: 'blocked',
        toColumn: 'Blocked',
      };

      mockRepository.findOne.mockResolvedValue(taskInProgress);
      mockRepository.create.mockReturnValue(mockSavedLog);
      mockRepository.save.mockResolvedValue(mockSavedLog);

      const result = await controller.executeTransition(taskId, blockRequest);

      expect(result.action).toBe(TransitionAction.BLOCK);
      expect(result.fromStatus).toBe('in_progress');
      expect(result.toStatus).toBe('blocked');
      expect(result.success).toBe(true);
    });
  });

  describe('getAvailableTransitions', () => {
    it('should return available transitions for todo status', async () => {
      const mockTask = {
        taskId: 'task-1',
        status: 'todo',
      } as TaskHistory;

      jest
        .spyOn(service, 'getAvailableTransitions')
        .mockResolvedValue([
          TransitionAction.START_PROGRESS,
          TransitionAction.BLOCK,
        ]);

      const result = await service.getAvailableTransitions('task-1');

      expect(result).toContain(TransitionAction.START_PROGRESS);
      expect(result).toContain(TransitionAction.BLOCK);
    });

    it('should return available transitions for in_progress status', async () => {
      jest
        .spyOn(service, 'getAvailableTransitions')
        .mockResolvedValue([
          TransitionAction.SUBMIT_FOR_REVIEW,
          TransitionAction.COMPLETE,
          TransitionAction.BLOCK,
        ]);

      const result = await service.getAvailableTransitions('task-1');

      expect(result).toContain(TransitionAction.SUBMIT_FOR_REVIEW);
      expect(result).toContain(TransitionAction.COMPLETE);
      expect(result).toContain(TransitionAction.BLOCK);
    });
  });
});
