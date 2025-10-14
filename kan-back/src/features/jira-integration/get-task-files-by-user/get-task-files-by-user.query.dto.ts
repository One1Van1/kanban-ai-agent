import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  VIDEO = 'video',
  OTHER = 'other',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  FILE_SIZE = 'fileSize',
  FILE_NAME = 'fileName',
  FILE_TYPE = 'fileType',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTaskFilesByUserQueryDto {
  @ApiProperty({
    enum: FileType,
    enumName: 'FileType',
    example: FileType.IMAGE,
    description: 'Filter files by type',
    required: false,
  })
  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @ApiProperty({
    example: 10,
    description: 'Number of files per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiProperty({
    example: 1,
    description: 'Page number (starting from 1)',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({
    enum: SortBy,
    enumName: 'SortBy',
    example: SortBy.CREATED_AT,
    description: 'Field to sort by',
    default: SortBy.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;

  @ApiProperty({
    enum: SortOrder,
    enumName: 'SortOrder',
    example: SortOrder.DESC,
    description: 'Sort order',
    default: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiProperty({
    example: 'screenshot',
    description: 'Search files by name (partial match)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
