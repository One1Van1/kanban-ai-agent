import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class AddTaskTimelogRequestDto {
  @ApiProperty({
    description: 'Description of work performed',
    example: 'Implemented user authentication module',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Time spent in minutes',
    example: 120,
    minimum: 1,
    maximum: 1440, // 24 hours
  })
  @IsNumber()
  @Min(1)
  @Max(1440)
  timeSpentMinutes: number;

  @ApiProperty({
    description: 'When work started (ISO string)',
    example: '2024-01-15T09:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'When work ended (ISO string)',
    example: '2024-01-15T11:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'User ID who performed the work',
    example: 'agent-001',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Additional notes or context',
    example: 'Used TDD approach, included unit tests',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
