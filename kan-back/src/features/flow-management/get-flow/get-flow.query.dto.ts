import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFlowQueryDto {
  @ApiProperty({
    description: 'Unique identifier of the flow',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
