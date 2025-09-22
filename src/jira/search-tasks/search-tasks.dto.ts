import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTasksDto {
  @ApiProperty({
    description: 'JQL запрос для поиска задач',
    example: 'project = "KAN" AND status = "In Progress"',
  })
  @IsString()
  jql: string;

  @ApiProperty({
    description: 'Максимальное количество результатов',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxResults?: number;
}
