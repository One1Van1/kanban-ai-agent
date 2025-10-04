import { ApiProperty } from '@nestjs/swagger';

export class ProcessReportTaskResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Operation result message',
    example: 'Report task KAN-33 processed successfully',
  })
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
