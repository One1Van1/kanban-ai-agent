import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployToAgentRequestDto {
  @ApiProperty({
    description: 'User ID who is deploying the flow',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Optional agent name override',
    example: 'My Custom Agent',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentName?: string;

  @ApiProperty({
    description: 'Optional agent description override',
    example: 'Agent created from my flow',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentDescription?: string;
}
