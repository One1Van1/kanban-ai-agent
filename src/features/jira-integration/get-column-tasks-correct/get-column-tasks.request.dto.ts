import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetColumnTasksRequestDto {
  @ApiProperty({
    description: 'Статус колонки для получения задач',
    example: 'In Progress',
  })
  @IsString()
  columnStatus: string;

  @ApiProperty({
    description: 'Максимальное количество результатов',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  maxResults?: number;

  @ApiProperty({
    description: 'Фильтр по исполнителю',
    example: 'john.doe@company.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiProperty({
    description: 'Фильтр по приоритету',
    example: 'High',
    required: false,
  })
  @IsOptional()
  @IsString()
  priority?: string;
}
