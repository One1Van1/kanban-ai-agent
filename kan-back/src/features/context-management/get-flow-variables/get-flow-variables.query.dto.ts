import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';

export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
}

export enum VariableScope {
  GLOBAL = 'global',
  LOCAL = 'local',
  SHARED = 'shared',
  TEMPORARY = 'temporary',
}

export class GetFlowVariablesQueryDto {
  @ApiProperty({
    enum: VariableType,
    enumName: 'VariableType',
    example: VariableType.STRING,
    description: 'Filter variables by type',
    required: false,
  })
  @IsOptional()
  @IsEnum(VariableType)
  type?: VariableType;

  @ApiProperty({
    enum: VariableScope,
    enumName: 'VariableScope',
    example: VariableScope.GLOBAL,
    description: 'Filter variables by scope',
    required: false,
  })
  @IsOptional()
  @IsEnum(VariableScope)
  scope?: VariableScope;

  @ApiProperty({
    example: 'user',
    description: 'Search variables by name or description (partial match)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: true,
    description: 'Include only variables with values (exclude undefined/null)',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasValue?: boolean;

  @ApiProperty({
    example: false,
    description: 'Include system/internal variables in response',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeSystem?: boolean;
}
