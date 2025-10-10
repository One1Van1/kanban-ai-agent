import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTaskTimelogRequestDto {
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
    description: 'Number of timelog entries per page',
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
    description: 'Filter entries from this date (ISO string)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({
    description: 'Filter entries to this date (ISO string)',
    example: '2024-01-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
