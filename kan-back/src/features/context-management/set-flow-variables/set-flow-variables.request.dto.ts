import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export enum UpdateMode {
  REPLACE = 'replace',
  MERGE = 'merge',
  APPEND = 'append',
}

export class FlowVariableInputDto {
  @ApiProperty({
    example: 'user_email',
    description: 'Variable name/key',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@company.com',
    description: 'Variable value (can be any type)',
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({
    enum: VariableType,
    enumName: 'VariableType',
    example: VariableType.STRING,
    description: 'Type of the variable',
  })
  @IsEnum(VariableType)
  type: VariableType;

  @ApiProperty({
    enum: VariableScope,
    enumName: 'VariableScope',
    example: VariableScope.GLOBAL,
    description: 'Scope of the variable',
  })
  @IsEnum(VariableScope)
  scope: VariableScope;

  @ApiProperty({
    example: 'Email address of the current user',
    description: 'Variable description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the variable is read-only',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isReadOnly?: boolean;

  @ApiProperty({
    example: ['user', 'email', 'contact'],
    description: 'Tags for categorizing variables',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class SetFlowVariablesRequestDto {
  @ApiProperty({
    type: [FlowVariableInputDto],
    description: 'Array of variables to set/update',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FlowVariableInputDto)
  variables: FlowVariableInputDto[];

  @ApiProperty({
    enum: UpdateMode,
    enumName: 'UpdateMode',
    example: UpdateMode.REPLACE,
    description: 'How to handle existing variables',
    default: UpdateMode.REPLACE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UpdateMode)
  updateMode?: UpdateMode;

  @ApiProperty({
    example: 'step_3',
    description: 'Flow step that is setting these variables',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    example: false,
    description: 'Whether to overwrite read-only variables',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  overwriteReadOnly?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether to validate variable types before setting',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  validateTypes?: boolean;
}
