import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveTaskDto {
  @ApiProperty({
    description: 'Название целевого статуса (колонки)',
    example: 'Done',
    enum: ['New', 'backlog', 'Questions', 'In Progress', 'Review', 'Done'],
  })
  @IsString()
  targetStatus: string;

  @ApiProperty({
    description: 'Комментарий к перемещению (необязательно)',
    example: 'Задача завершена согласно требованиям',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
