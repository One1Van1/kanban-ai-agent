import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

export enum AgentActionTrigger {
  TASK_MOVED_TO_COLUMN = 'task_moved_to_column',
  TASK_ASSIGNED = 'task_assigned',
  TASK_PRIORITY_CHANGED = 'task_priority_changed',
  TASK_DUE_DATE_APPROACHING = 'task_due_date_approaching',
  MANUAL_TRIGGER = 'manual_trigger',
}

export class ExecuteAgentActionRequestDto {
  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent to execute',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    example: 'task_456',
    description: 'ID of the task that triggered the action',
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    example: 'board_789',
    description: 'ID of the Kanban board',
  })
  @IsString()
  boardId: string;

  @ApiProperty({
    example: 'column_123',
    description: 'ID of the current column',
  })
  @IsString()
  columnId: string;

  @ApiProperty({
    example: 'In Progress',
    description: 'Name of the current column',
  })
  @IsString()
  columnName: string;

  @ApiProperty({
    enum: AgentActionTrigger,
    enumName: 'AgentActionTrigger',
    example: AgentActionTrigger.TASK_MOVED_TO_COLUMN,
    description: 'What triggered this agent action',
  })
  @IsEnum(AgentActionTrigger)
  triggerType: AgentActionTrigger;

  @ApiProperty({
    example: {
      taskTitle: 'Fix login bug',
      taskDescription: 'Users cannot login after the recent update',
      priority: 'high',
      assignee: 'john.doe@example.com',
      previousColumn: 'To Do',
    },
    description: 'Task data and context information',
  })
  @IsObject()
  taskData: Record<string, any>;

  @ApiProperty({
    example: {
      userProfile: { name: 'John Doe', role: 'developer' },
      relatedTasks: ['task_111', 'task_222'],
      projectSettings: { autoAssignReviewer: true },
    },
    description: 'Additional context for the AI agent',
    required: false,
  })
  @IsOptional()
  @IsObject()
  additionalContext?: Record<string, any>;
}
