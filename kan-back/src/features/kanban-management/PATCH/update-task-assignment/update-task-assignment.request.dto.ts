import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AssignmentAction {
  ASSIGN = 'assign',
  REASSIGN = 'reassign',
  UNASSIGN = 'unassign',
  ADD_WATCHER = 'add_watcher',
  REMOVE_WATCHER = 'remove_watcher',
}

export class AssignmentDetails {
  @ApiProperty({
    description: 'User ID being assigned',
    example: 'agent-002',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Role in assignment',
    example: 'primary_assignee',
    enum: ['primary_assignee', 'secondary_assignee', 'reviewer', 'watcher'],
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Assignment start date',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'Assignment end date',
    example: '2024-01-20T17:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class UpdateTaskAssignmentRequestDto {
  @ApiProperty({
    enum: AssignmentAction,
    enumName: 'AssignmentAction',
    example: AssignmentAction.REASSIGN,
    description: 'Type of assignment action to perform',
  })
  @IsEnum(AssignmentAction)
  action: AssignmentAction;

  @ApiProperty({
    description: 'Primary assignee ID',
    example: 'agent-002',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiProperty({
    description: 'List of watchers for this task',
    example: ['agent-003', 'agent-004'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  watchers?: string[];

  @ApiProperty({
    description: 'Detailed assignment information',
    type: [AssignmentDetails],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentDetails)
  assignmentDetails?: AssignmentDetails[];

  @ApiProperty({
    description: 'User performing the assignment update',
    example: 'agent-001',
  })
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: 'Reason for assignment change',
    example: 'Reassigning to team member with more relevant expertise',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignmentReason?: string;

  @ApiProperty({
    description: 'Whether to notify assigned users',
    example: true,
    required: false,
  })
  @IsOptional()
  notifyAssignees?: boolean;

  @ApiProperty({
    description: 'Priority level for this assignment',
    example: 'normal',
    enum: ['low', 'normal', 'high', 'urgent'],
    required: false,
  })
  @IsOptional()
  @IsString()
  assignmentPriority?: string;
}
