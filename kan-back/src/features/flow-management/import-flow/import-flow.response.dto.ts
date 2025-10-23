import { ApiProperty } from '@nestjs/swagger';
import { ImportMode } from './import-flow.body.dto';

export class ImportFlowResponseDto {
  @ApiProperty({
    description: 'Import status',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Message describing the import result',
    example: 'Flow imported successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Imported flow ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Flow name',
    example: 'Imported Flow',
  })
  flowName: string;

  @ApiProperty({
    description: 'Import mode used',
    example: ImportMode.CREATE_NEW,
    enum: ImportMode,
    enumName: 'ImportMode',
  })
  importMode: ImportMode;

  @ApiProperty({
    description: 'Whether this was a new flow or a replacement',
    example: true,
  })
  isNewFlow: boolean;

  constructor(partial: Partial<ImportFlowResponseDto>) {
    Object.assign(this, partial);
  }
}
