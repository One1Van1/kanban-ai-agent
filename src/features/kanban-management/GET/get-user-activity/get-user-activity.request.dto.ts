import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ActivityType {
  ALL = 'all',
  CREATED = 'created',
  UPDATED = 'updated',
  ASSIGNED = 'assigned',
  COMMENTED = 'commented',
  STATUS_CHANGED = 'status_changed',
}

export class GetUserActivityRequestDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of activities per page',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    enum: ActivityType,
    enumName: 'ActivityType',
    example: ActivityType.ALL,
    description: 'Filter by activity type',
    required: false,
  })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType = ActivityType.ALL;
}
