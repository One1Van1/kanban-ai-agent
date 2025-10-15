import { ApiProperty } from '@nestjs/swagger';

export class ExecuteFlowResponseDto {
  @ApiProperty({
    description: 'Execution ID for tracking',
    example: 'exec-789e0123-e89b-12d3-a456-426614174000',
  })
  executionId: string;

  @ApiProperty({
    description: 'Flow ID that was executed',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Flow name',
    example: 'AI Content Analysis Flow',
  })
  flowName: string;

  @ApiProperty({
    description: 'Generated agent instructions',
    example: [
      '1. Извлеки все прикрепленные файлы из задачи',
      '2. Выполни AI анализ контента с промптом: "Analyze complexity"',
      '3. Проверь условие: complexity > 5',
      '4. Перемести карточку в колонку: In Review',
    ],
  })
  instructions: string[];

  @ApiProperty({
    description: 'Execution status',
    example: 'queued',
    enum: ['queued', 'executing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({
    description: 'Context data used for execution',
    example: {
      taskId: 'task-123',
      boardColumn: 'In Progress',
      userId: 'user-456',
    },
  })
  context: any;

  @ApiProperty({
    description: 'User who executed the flow',
    example: 'user-456',
  })
  executedBy: string;

  @ApiProperty({
    description: 'Execution timestamp',
    example: '2023-10-15T13:00:00.000Z',
  })
  executedAt: Date;

  constructor(data: Partial<ExecuteFlowResponseDto>) {
    Object.assign(this, data);
  }
}
