import { ApiProperty } from '@nestjs/swagger';
import { TransitionAction } from './execute-task-transition.request.dto';

export interface TransitionMetadata {
  fromStatus: string;
  toStatus: string;
  fromColumn?: string;
  toColumn?: string;
  action: TransitionAction;
  comment?: string;
  resolution?: string;
  executedBy: string;
  executedAt: Date;
}

export class ExecuteTaskTransitionResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  taskId: string;

  @ApiProperty({
    enum: TransitionAction,
    enumName: 'TransitionAction',
    example: TransitionAction.START_PROGRESS,
    description: 'Executed transition action',
  })
  action: TransitionAction;

  @ApiProperty({
    description: 'Status before transition',
    example: 'todo',
  })
  fromStatus: string;

  @ApiProperty({
    description: 'Status after transition',
    example: 'in_progress',
  })
  toStatus: string;

  @ApiProperty({
    description: 'Column before transition',
    example: 'To Do',
    required: false,
  })
  fromColumn?: string;

  @ApiProperty({
    description: 'Column after transition',
    example: 'In Progress',
    required: false,
  })
  toColumn?: string;

  @ApiProperty({
    description: 'User who executed the transition',
    example: 'agent-001',
  })
  executedBy: string;

  @ApiProperty({
    description: 'Timestamp when transition was executed',
    example: '2024-01-15T10:30:00Z',
  })
  executedAt: Date;

  @ApiProperty({
    description: 'Comment about the transition',
    example: 'Starting work on this task after clarification',
    required: false,
  })
  comment?: string;

  @ApiProperty({
    description: 'Resolution if task was completed',
    example: 'Fixed',
    required: false,
  })
  resolution?: string;

  @ApiProperty({
    description: 'Whether transition was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'History log ID for this transition',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
