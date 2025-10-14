import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class CancelFlowExecutionQueryDto {
  @ApiProperty({
    description:
      "Force cancellation even if it's not safe (may cause side effects)",
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean = false;
}
