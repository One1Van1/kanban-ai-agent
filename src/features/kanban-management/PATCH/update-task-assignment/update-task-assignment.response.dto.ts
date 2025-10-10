import { ApiProperty } from '@nestjs/swagger';
import {
  AssignmentAction,
  AssignmentDetails,
} from './update-task-assignment.request.dto';

export interface AssignmentChangeMetadata {
  action: AssignmentAction;
  previousAssignee?: string;
  newAssignee?: string;
  watchersAdded: string[];
  watchersRemoved: string[];
  assignmentHistory: {
    userId: string;
    action: string;
    timestamp: Date;
  }[];
}

export class UpdateTaskAssignmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  taskId: string;

  @ApiProperty({
    enum: AssignmentAction,
    enumName: 'AssignmentAction',
    example: AssignmentAction.REASSIGN,
    description: 'Assignment action that was performed',
  })
  action: AssignmentAction;

  @ApiProperty({
    description: 'Current primary assignee',
    example: 'agent-002',
    required: false,
  })
  assignee?: string;

  @ApiProperty({
    description: 'Previous assignee before update',
    example: 'agent-001',
    required: false,
  })
  previousAssignee?: string;

  @ApiProperty({
    description: 'List of current watchers',
    example: ['agent-003', 'agent-004'],
    type: [String],
    required: false,
  })
  watchers?: string[];

  @ApiProperty({
    description: 'Detailed assignment information',
    type: [AssignmentDetails],
    required: false,
  })
  assignmentDetails?: AssignmentDetails[];

  @ApiProperty({
    description: 'User who performed the assignment update',
    example: 'agent-001',
  })
  updatedBy: string;

  @ApiProperty({
    description: 'Timestamp when assignment was updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Reason for assignment change',
    example: 'Reassigning to team member with more relevant expertise',
    required: false,
  })
  assignmentReason?: string;

  @ApiProperty({
    description: 'List of users who were added as watchers',
    example: ['agent-005'],
    type: [String],
  })
  watchersAdded: string[];

  @ApiProperty({
    description: 'List of users who were removed as watchers',
    example: ['agent-003'],
    type: [String],
  })
  watchersRemoved: string[];

  @ApiProperty({
    description: 'Whether notifications were sent to assignees',
    example: true,
  })
  notificationsSent: boolean;

  @ApiProperty({
    description: 'Assignment priority level',
    example: 'normal',
    required: false,
  })
  assignmentPriority?: string;

  @ApiProperty({
    description: 'Whether assignment update was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Total number of assignment changes for this task',
    example: 3,
  })
  assignmentVersion: number;

  @ApiProperty({
    description: 'History log ID for this assignment change',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
