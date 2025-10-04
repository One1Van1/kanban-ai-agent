import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackAgentInTaskRequestDto {
  @ApiProperty({
    description: 'Task ID from external system (e.g., Jira)',
    example: 'PROJ-123',
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    description: 'Board ID where task is located',
    example: 'board-456',
  })
  @IsString()
  boardId: string;

  @ApiProperty({
    description: 'Column ID where task is currently located',
    example: 'col-789',
  })
  @IsString()
  columnId: string;

  @ApiPropertyOptional({
    description: 'Column name for better readability',
    example: 'To Do',
  })
  @IsOptional()
  @IsString()
  columnName?: string;

  @ApiPropertyOptional({ description: 'Additional task data for context' })
  @IsOptional()
  @IsObject()
  taskData?: any;

  @ApiPropertyOptional({
    description: 'Trigger type that caused this tracking',
    example: 'task_moved_to_column',
  })
  @IsOptional()
  @IsString()
  triggerType?: string;
}
