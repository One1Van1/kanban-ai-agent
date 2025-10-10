import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveTaskRequestDto {
  @ApiProperty({
    description: 'Название целевого статуса (колонки)',
    example: 'Done',
    enum: ['New', 'backlog', 'Questions', 'In Progress', 'Review', 'Done'],
  })
  @IsString()
  targetColumn: string;

  @ApiProperty({
    description: 'Комментарий к перемещению',
    example: 'Задача выполнена',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
