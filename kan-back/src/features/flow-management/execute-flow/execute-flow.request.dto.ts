import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteFlowRequestDto {
  @ApiProperty({
    description: 'Context data for flow execution',
    example: {
      taskId: 'task-123',
      boardColumn: 'In Progress',
      userId: 'user-456',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  context?: {
    taskId?: string;
    boardColumn?: string;
    userId?: string;
    [key: string]: any;
  };

  @ApiProperty({
    description: 'User who executes the flow',
    example: 'user-456',
  })
  @IsString()
  @IsNotEmpty()
  executedBy: string;
}
