import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  MaxLength,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export class UpdateTaskRequestDto {
  @ApiProperty({
    example: 'Обновленное название задачи',
    description: 'New title for the task',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiProperty({
    example: 'Обновленное описание задачи с новыми требованиями',
    description: 'New description for the task',
    maxLength: 5000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'New priority level for the task',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    example: 'new.assignee@example.com',
    description: 'Email of the new assignee',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  assigneeEmail?: string;

  @ApiProperty({
    example: 'New Assignee',
    description: 'Name of the new assignee',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assigneeName?: string;

  @ApiProperty({
    example: 'TASK-NEW-123',
    description: 'New task key/identifier',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  taskKey?: string;

  @ApiProperty({
    example: ['frontend', 'urgent', 'customer-request'],
    description: 'Updated tags for the task',
    required: false,
  })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: '2024-02-15T10:00:00Z',
    description: 'New due date for the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({
    example: 8,
    description: 'Estimated hours to complete the task',
    required: false,
  })
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({
    example: {
      department: 'backend',
      epic: 'user-management',
      storyPoints: 5,
      customFields: {
        clientId: 'client-123',
        bugfix: false,
      },
    },
    description: 'Additional context and custom fields for the task',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;

  @ApiProperty({
    example: 'Обновляю задачу после обратной связи от клиента',
    description: 'Reason for the update',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  updateReason?: string;

  @ApiProperty({
    example: 'manager@example.com',
    description: 'Email of the person making the update',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  updatedByEmail?: string;

  @ApiProperty({
    example: 'Project Manager',
    description: 'Name of the person making the update',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  updatedByName?: string;

  @ApiProperty({
    example: 'uuid-agent-123',
    description: 'ID of the agent performing this update',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiProperty({
    example: 'agent_instruction',
    description: 'What triggered this update',
    required: false,
    default: 'manual',
  })
  @IsOptional()
  @IsString()
  triggerType?: string = 'manual';

  @ApiProperty({
    example: false,
    description: 'Whether to preserve the current task status and column',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  preservePosition?: boolean = true;

  @ApiProperty({
    example: true,
    description: 'Whether to send notifications about the update',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendNotifications?: boolean = true;
}
