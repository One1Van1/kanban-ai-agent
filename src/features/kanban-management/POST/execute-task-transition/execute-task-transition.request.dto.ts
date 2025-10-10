import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum TransitionAction {
  START_PROGRESS = 'start_progress',
  SUBMIT_FOR_REVIEW = 'submit_for_review',
  APPROVE = 'approve',
  REQUEST_CHANGES = 'request_changes',
  COMPLETE = 'complete',
  BLOCK = 'block',
  UNBLOCK = 'unblock',
  REOPEN = 'reopen',
  CLOSE = 'close',
}

export class ExecuteTaskTransitionRequestDto {
  @ApiProperty({
    enum: TransitionAction,
    enumName: 'TransitionAction',
    example: TransitionAction.START_PROGRESS,
    description: 'Transition action to execute',
  })
  @IsEnum(TransitionAction)
  action: TransitionAction;

  @ApiProperty({
    description: 'Target status after transition',
    example: 'in_progress',
  })
  @IsString()
  toStatus: string;

  @ApiProperty({
    description: 'Target column after transition',
    example: 'In Progress',
    required: false,
  })
  @IsOptional()
  @IsString()
  toColumn?: string;

  @ApiProperty({
    description: 'User executing the transition',
    example: 'agent-001',
  })
  @IsString()
  executedBy: string;

  @ApiProperty({
    description: 'Optional comment about the transition',
    example: 'Starting work on this task after clarification',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Optional resolution for completing tasks',
    example: 'Fixed',
    required: false,
  })
  @IsOptional()
  @IsString()
  resolution?: string;
}
