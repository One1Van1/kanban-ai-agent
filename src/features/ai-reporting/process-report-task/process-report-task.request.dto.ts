import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessReportTaskRequestDto {
  @ApiProperty({
    description: 'Task key to process',
    example: 'KAN-33',
  })
  @IsString()
  taskKey: string;
}
