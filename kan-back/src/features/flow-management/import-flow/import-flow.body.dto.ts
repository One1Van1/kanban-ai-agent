import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum ImportMode {
  CREATE_NEW = 'create_new',
  REPLACE_EXISTING = 'replace_existing',
}

export class ImportFlowBodyDto {
  @ApiProperty({
    description: 'Export format version',
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    description: 'Flow name',
    example: 'Imported Flow',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Flow description',
    example: 'This flow was imported from JSON',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Flow status',
    example: 'draft',
    enum: ['draft', 'active', 'archived'],
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Flow definition with blocks and connections',
    example: {
      blocks: [],
      connections: [],
    },
  })
  @IsObject()
  @IsNotEmpty()
  definition: any;

  @ApiProperty({
    description: 'Flow metadata',
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: any;

  @ApiProperty({
    description: 'Import mode: create new flow or replace existing',
    example: ImportMode.CREATE_NEW,
    enum: ImportMode,
    enumName: 'ImportMode',
    required: false,
    default: ImportMode.CREATE_NEW,
  })
  @IsEnum(ImportMode)
  @IsOptional()
  importMode?: ImportMode;

  @ApiProperty({
    description:
      'Flow ID to replace (required if importMode is REPLACE_EXISTING)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  flowIdToReplace?: string;

  @ApiProperty({
    description:
      'Created by user (will be set to current user if not provided)',
    example: 'user-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
