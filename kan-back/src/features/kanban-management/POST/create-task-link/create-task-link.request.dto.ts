import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum TaskLinkType {
  BLOCKS = 'blocks',
  BLOCKED_BY = 'blocked_by',
  RELATES_TO = 'relates_to',
  DUPLICATES = 'duplicates',
  CLONES = 'clones',
  DEPENDS_ON = 'depends_on',
  REQUIRED_BY = 'required_by',
}

export class CreateTaskLinkRequestDto {
  @ApiProperty({
    description: 'ID of the target task to link to',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  })
  @IsUUID()
  targetTaskId: string;

  @ApiProperty({
    enum: TaskLinkType,
    enumName: 'TaskLinkType',
    example: TaskLinkType.BLOCKS,
    description: 'Type of relationship between tasks',
  })
  @IsEnum(TaskLinkType)
  linkType: TaskLinkType;

  @ApiProperty({
    description: 'Optional description of the link relationship',
    example: 'This task must be completed before the target task can start',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'User who created the link',
    example: 'agent-001',
  })
  @IsString()
  createdBy: string;
}
