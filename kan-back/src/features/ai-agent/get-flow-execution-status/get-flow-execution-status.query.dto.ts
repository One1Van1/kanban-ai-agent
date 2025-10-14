import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class GetFlowExecutionStatusQueryDto {
  @ApiProperty({
    example: true,
    description: 'Include detailed step information in response',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeSteps?: boolean;

  @ApiProperty({
    example: true,
    description: 'Include execution logs in response',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeLogs?: boolean;

  @ApiProperty({
    example: false,
    description: 'Include variable values in response',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeVariables?: boolean;

  @ApiProperty({
    example: true,
    description: 'Include performance metrics in response',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeMetrics?: boolean;
}
