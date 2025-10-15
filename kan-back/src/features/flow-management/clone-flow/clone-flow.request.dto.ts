import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloneFlowRequestDto {
  @ApiProperty({
    description: 'Name for the cloned flow',
    example: 'Copy of AI Content Analysis Flow',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description for the cloned flow',
    example: 'Cloned from original flow for testing purposes',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'User ID who clones the flow',
    example: 'user-456',
  })
  @IsString()
  @IsNotEmpty()
  clonedBy: string;
}
