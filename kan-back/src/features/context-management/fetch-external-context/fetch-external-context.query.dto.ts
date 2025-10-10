import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ExternalSourceType {
  CONFLUENCE = 'confluence',
  SLACK = 'slack',
  GITHUB = 'github',
  DOCUMENTATION = 'documentation',
  KNOWLEDGE_BASE = 'knowledge_base',
  PREVIOUS_TICKETS = 'previous_tickets',
  CODE_REPOSITORY = 'code_repository',
  API_DOCUMENTATION = 'api_documentation',
}

export class FetchExternalContextQueryDto {
  @ApiProperty({
    enum: ExternalSourceType,
    enumName: 'ExternalSourceType',
    isArray: true,
    example: [ExternalSourceType.CONFLUENCE, ExternalSourceType.GITHUB],
    description: 'Типы внешних источников для сбора контекста',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ExternalSourceType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  sources?: ExternalSourceType[];

  @ApiProperty({
    description: 'Ключевые слова для поиска в внешних источниках',
    example: ['authentication', 'user management', 'API'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  keywords?: string[];

  @ApiProperty({
    description: 'Глубина поиска в днях (насколько далеко искать в истории)',
    example: 30,
    required: false,
    default: 30,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  searchDepthDays?: number = 30;

  @ApiProperty({
    description: 'Включить контекст из связанных проектов',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeRelatedProjects?: boolean = false;

  @ApiProperty({
    description: 'Максимальное количество результатов с каждого источника',
    example: 5,
    required: false,
    default: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxResultsPerSource?: number = 5;
}
