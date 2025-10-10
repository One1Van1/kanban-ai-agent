import { Test, TestingModule } from '@nestjs/testing';
import { ConfigureColumnInstructionsController } from './configure-column-instructions.controller';
import { ConfigureColumnInstructionsService } from './configure-column-instructions.service';
import {
  ConfigureColumnInstructionsRequestDto,
  TriggerConditionType,
  TriggerOperator,
} from './configure-column-instructions.request.dto';

describe('ConfigureColumnInstructionsController', () => {
  let controller: ConfigureColumnInstructionsController;
  let service: ConfigureColumnInstructionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigureColumnInstructionsController],
      providers: [ConfigureColumnInstructionsService],
    }).compile();

    controller = module.get<ConfigureColumnInstructionsController>(
      ConfigureColumnInstructionsController,
    );
    service = module.get<ConfigureColumnInstructionsService>(
      ConfigureColumnInstructionsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should configure column instructions successfully', async () => {
      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: 'agent_123',
        boardId: 'board_456',
        columnId: 'column_789',
        columnName: 'In Progress',
        instructions:
          'When a task moves to this column, check priority and notify assignee if high priority',
        triggerConditions: [
          {
            type: TriggerConditionType.TASK_MOVED_TO_COLUMN,
            value: undefined,
            operator: undefined,
          },
        ],
        isActive: true,
      };

      const result = await controller.handle(request);

      expect(result).toBeDefined();
      expect(result.message).toBe(
        'Column instructions configured successfully',
      );
      expect(result.columnInstruction).toBeDefined();
      expect(result.columnInstruction.agentId).toBe(request.agentId);
      expect(result.columnInstruction.boardId).toBe(request.boardId);
      expect(result.columnInstruction.columnId).toBe(request.columnId);
      expect(result.columnInstruction.columnName).toBe(request.columnName);
      expect(result.columnInstruction.instructions).toBe(request.instructions);
      expect(result.columnInstruction.isActive).toBe(request.isActive);
      expect(result.columnInstruction.id).toBeDefined();
      expect(result.columnInstruction.createdAt).toBeDefined();
      expect(result.columnInstruction.updatedAt).toBeDefined();
    });

    it('should configure column instructions with multiple trigger conditions', async () => {
      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: 'agent_456',
        boardId: 'board_789',
        columnId: 'column_123',
        columnName: 'Ready for Review',
        instructions:
          'Check if all required fields are filled and assign reviewer',
        triggerConditions: [
          {
            type: TriggerConditionType.TASK_MOVED_TO_COLUMN,
            value: undefined,
            operator: undefined,
          },
          {
            type: TriggerConditionType.TASK_PRIORITY_CHANGED,
            value: 'high',
            operator: TriggerOperator.EQUALS,
          },
        ],
        isActive: true,
      };

      const result = await controller.handle(request);

      expect(result).toBeDefined();
      expect(result.columnInstruction.triggerConditions).toHaveLength(2);
      expect(result.columnInstruction.triggerConditions![0].type).toBe(
        TriggerConditionType.TASK_MOVED_TO_COLUMN,
      );
      expect(result.columnInstruction.triggerConditions![1].type).toBe(
        TriggerConditionType.TASK_PRIORITY_CHANGED,
      );
      expect(result.columnInstruction.triggerConditions![1].value).toBe('high');
      expect(result.columnInstruction.triggerConditions![1].operator).toBe(
        TriggerOperator.EQUALS,
      );
    });

    it('should throw error for empty agent ID', async () => {
      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: '',
        boardId: 'board_456',
        columnId: 'column_789',
        columnName: 'In Progress',
        instructions: 'Test instructions',
        isActive: true,
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'Agent ID is required',
      );
    });

    it('should throw error for empty board ID', async () => {
      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: 'agent_123',
        boardId: '',
        columnId: 'column_789',
        columnName: 'In Progress',
        instructions: 'Test instructions',
        isActive: true,
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'Board ID is required',
      );
    });

    it('should throw error for too long instructions', async () => {
      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: 'agent_123',
        boardId: 'board_456',
        columnId: 'column_789',
        columnName: 'In Progress',
        instructions: 'x'.repeat(5001), // 5001 characters
        isActive: true,
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'Instructions cannot exceed 5000 characters',
      );
    });

    it('should throw error for too many trigger conditions', async () => {
      const triggerConditions = Array(11).fill({
        type: TriggerConditionType.TASK_MOVED_TO_COLUMN,
        value: 'test',
        operator: TriggerOperator.EQUALS,
      });

      const request: ConfigureColumnInstructionsRequestDto = {
        agentId: 'agent_123',
        boardId: 'board_456',
        columnId: 'column_789',
        columnName: 'In Progress',
        instructions: 'Test instructions',
        triggerConditions,
        isActive: true,
      };

      await expect(controller.handle(request)).rejects.toThrow(
        'Cannot have more than 10 trigger conditions',
      );
    });
  });
});
