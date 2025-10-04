import { ApiProperty } from '@nestjs/swagger';

export class MoveTaskResponseDto {
  @ApiProperty({
    description: 'Статус успешности операции',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Предыдущий статус',
    example: 'In Progress',
  })
  previousStatus: string;

  @ApiProperty({
    description: 'Новый статус',
    example: 'Done',
  })
  newStatus: string;

  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Task moved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Обновленная задача',
    required: false,
  })
  updatedTask?: any;

  @ApiProperty({
    description: 'Сообщение об ошибке (если есть)',
    required: false,
  })
  error?: string;

  constructor(
    success: boolean,
    taskKey: string,
    previousStatus: string,
    newStatus: string,
    message: string,
    updatedTask?: any,
    error?: string,
  ) {
    this.success = success;
    this.taskKey = taskKey;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
    this.message = message;
    this.updatedTask = updatedTask;
    this.error = error;
  }
}
