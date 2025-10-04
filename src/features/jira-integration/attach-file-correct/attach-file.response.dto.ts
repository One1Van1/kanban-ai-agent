import { ApiProperty } from '@nestjs/swagger';

export class AttachFileResponseDto {
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
    description: 'Сообщение о результате',
    example: 'File attached successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Сообщение об ошибке (если есть)',
    required: false,
    example: 'File not found',
  })
  error?: string;

  constructor(
    success: boolean,
    taskKey: string,
    message: string,
    error?: string,
  ) {
    this.success = success;
    this.taskKey = taskKey;
    this.message = message;
    this.error = error;
  }
}
