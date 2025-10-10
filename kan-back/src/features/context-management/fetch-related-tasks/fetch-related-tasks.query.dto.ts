import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum RelationshipType {
  BLOCKS = 'blocks',
  BLOCKED_BY = 'blocked_by',
  DEPENDS_ON = 'depends_on',
  RELATED_TO = 'related_to',
  DUPLICATE = 'duplicate',
  SUBTASK = 'subtask',
  PARENT = 'parent',
}

export class FetchRelatedTasksQueryDto {
  @ApiProperty({
    enum: RelationshipType,
    enumName: 'RelationshipType',
    example: RelationshipType.RELATED_TO,
    description: 'Тип связи между задачами',
    required: false,
  })
  @IsOptional()
  @IsEnum(RelationshipType)
  relationshipType?: RelationshipType;

  @ApiProperty({
    description: 'Максимальное количество возвращаемых связанных задач',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Включить подзадачи в результат',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeSubtasks?: boolean = true;

  @ApiProperty({
    description: 'Включить родительские задачи в результат',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeParents?: boolean = true;
}
