import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';

export class ProcessHaircutTaskDto {
  @IsNotEmpty()
  @IsString()
  webhookEvent: string;

  @IsNotEmpty()
  @IsString()
  taskKey: string;

  @IsNotEmpty()
  @IsString()
  taskSummary: string;

  @IsOptional()
  @IsString()
  taskDescription?: string;

  @IsNotEmpty()
  @IsString()
  currentStatus: string;

  @IsOptional()
  @IsString()
  fromStatus?: string;

  @IsOptional()
  @IsString()
  assigneeName?: string;

  @IsOptional()
  @IsNumber()
  totalTimeSeconds?: number;

  @IsOptional()
  @IsArray()
  worklogEntries?: Array<{
    timeSpentSeconds: number;
    started: string;
    author?: {
      displayName: string;
    };
    comment?: string;
  }>;

  @IsOptional()
  @IsArray()
  comments?: Array<{
    body: string;
    author?: {
      displayName: string;
    };
    created?: string;
  }>;

  @IsOptional()
  @IsString()
  timestamp?: string;
}
