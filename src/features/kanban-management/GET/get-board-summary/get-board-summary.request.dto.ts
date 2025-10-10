import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetBoardSummaryRequestDto {
  @ApiProperty({
    description: 'Board ID to get summary for (optional)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  boardId?: string;

  @ApiProperty({
    description: 'Include detailed statistics',
    example: true,
    required: false,
  })
  @IsOptional()
  includeDetails?: boolean = false;
}
