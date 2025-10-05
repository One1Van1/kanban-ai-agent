import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteAgentActionController } from './execute-agent-action.controller';
import { ExecuteAgentActionService } from './execute-agent-action.service';
import {
  ExecuteAgentActionRequestDto,
  AgentActionTrigger,
} from './execute-agent-action.request.dto';
import { AgentActionResult } from './execute-agent-action.response.dto';

describe('ExecuteAgentActionController', () => {
  let controller: ExecuteAgentActionController;
  let service: ExecuteAgentActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecuteAgentActionController],
      providers: [ExecuteAgentActionService],
    }).compile();

    controller = module.get<ExecuteAgentActionController>(
      ExecuteAgentActionController,
    );
    service = module.get<ExecuteAgentActionService>(ExecuteAgentActionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should execute agent action successfully for high priority task', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: 'agent_123',
        taskId: 'task_456',
        boardId: 'board_789',
        columnId: 'column_123',
        columnName: 'In Progress',
        triggerType: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        taskData: {
          title: 'Fix critical bug',
          description: 'System crashes on login',
          priority: 'high',
          assignee: 'john.doe@example.com',
          previousColumn: 'To Do',
        },
      };

      const result = await controller.handle(request);

      expect(result).toBeDefined();
      expect(result.result).toBe(AgentActionResult.SUCCESS);
      expect(result.executionId).toBeDefined();
      expect(result.agentId).toBe(request.agentId);
      expect(result.taskId).toBe(request.taskId);
      expect(result.actions).toBeDefined();
      expect(result.actions.length).toBeGreaterThan(0);
      expect(result.summary).toBeDefined();
      expect(result.executionTimeMs).toBeGreaterThan(0);
      expect(result.executedAt).toBeDefined();
    });

    it('should execute priority notification for high priority task', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: 'agent_456',
        taskId: 'task_789',
        boardId: 'board_123',
        columnId: 'column_456',
        columnName: 'In Progress',
        triggerType: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        taskData: {
          title: 'Urgent fix needed',
          description: 'Production issue',
          priority: 'urgent',
          assignee: 'jane.smith@example.com',
        },
      };

      const result = await controller.handle(request);

      expect(result.result).toBe(AgentActionResult.SUCCESS);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].actionType).toBe('priority_notification');
      expect(result.actions[0].description).toContain(
        'High priority task notification sent',
      );
      expect(result.actions[0].data?.priority).toBe('urgent');
      expect(result.actions[0].data?.assignee).toBe('jane.smith@example.com');
    });

    it('should detect missing required fields', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: 'agent_789',
        taskId: 'task_123',
        boardId: 'board_456',
        columnId: 'column_789',
        columnName: 'In Progress',
        triggerType: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        taskData: {
          title: 'Incomplete task',
          priority: 'medium',
          // Missing description and assignee
        },
      };

      const result = await controller.handle(request);

      expect(result.result).toBe(AgentActionResult.SUCCESS);
      expect(
        result.actions.some(
          (action) => action.actionType === 'validation_warning',
        ),
      ).toBe(true);

      const validationAction = result.actions.find(
        (action) => action.actionType === 'validation_warning',
      );
      expect(validationAction).toBeDefined();
      expect(validationAction!.data?.missingFields).toContain('description');
      expect(validationAction!.data?.missingFields).toContain('assignee');
    });

    it('should handle task assignment trigger', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: 'agent_111',
        taskId: 'task_222',
        boardId: 'board_333',
        columnId: 'column_444',
        columnName: 'To Do',
        triggerType: AgentActionTrigger.TASK_ASSIGNED,
        taskData: {
          title: 'New task assigned',
          description: 'Please work on this task',
          assignee: 'bob.johnson@example.com',
          priority: 'medium',
        },
      };

      const result = await controller.handle(request);

      expect(result.result).toBe(AgentActionResult.SUCCESS);
      expect(
        result.actions.some(
          (action) => action.actionType === 'assignment_notification',
        ),
      ).toBe(true);

      const assignmentAction = result.actions.find(
        (action) => action.actionType === 'assignment_notification',
      );
      expect(assignmentAction).toBeDefined();
      expect(assignmentAction!.data?.assignee).toBe('bob.johnson@example.com');
      expect(assignmentAction!.data?.taskTitle).toBe('New task assigned');
    });

    it('should throw error for missing agent ID', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: '',
        taskId: 'task_456',
        boardId: 'board_789',
        columnId: 'column_123',
        columnName: 'In Progress',
        triggerType: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        taskData: { title: 'Test task' },
      };

      const result = await controller.handle(request);
      expect(result.result).toBe(AgentActionResult.ERROR);
      expect(result.error).toContain('Agent ID is required');
    });

    it('should throw error for empty task data', async () => {
      const request: ExecuteAgentActionRequestDto = {
        agentId: 'agent_123',
        taskId: 'task_456',
        boardId: 'board_789',
        columnId: 'column_123',
        columnName: 'In Progress',
        triggerType: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
        taskData: {},
      };

      const result = await controller.handle(request);
      expect(result.result).toBe(AgentActionResult.ERROR);
      expect(result.error).toContain('Task data is required');
    });
  });
});
