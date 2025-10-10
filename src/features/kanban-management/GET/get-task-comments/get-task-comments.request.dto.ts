import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum CommentSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTaskCommentsRequestDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of comments per page',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    enum: CommentSortOrder,
    enumName: 'CommentSortOrder',
    example: CommentSortOrder.DESC,
    description: 'Sort order for comments by creation date',
    required: false,
  })
  @IsOptional()
  @IsEnum(CommentSortOrder)
  sortOrder?: CommentSortOrder = CommentSortOrder.DESC;
}
