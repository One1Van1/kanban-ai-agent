import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для Jira Issue в webhook payload
 */
export class JiraIssueDto {
  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsObject()
  fields: {
    summary: string;
    description?: string;
    priority?: {
      name: string;
    };
    assignee?: {
      emailAddress: string;
      displayName: string;
    };
    labels?: string[];
    status: {
      name: string;
    };
  };
}

/**
 * DTO для Jira webhook payload
 */
export class JiraWebhookDto {
  @IsString()
  webhookEvent: string;

  @ValidateNested()
  @Type(() => JiraIssueDto)
  issue: JiraIssueDto;

  @IsOptional()
  @IsObject()
  changelog?: {
    items: Array<{
      field: string;
      fromString?: string;
      toString?: string;
    }>;
  };

  @IsOptional()
  @IsObject()
  user?: {
    emailAddress: string;
    displayName: string;
  };
}

/**
 * DTO для анализа задачи AI
 */
export class TaskAnalysisDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}

/**
 * DTO для результата AI анализа
 */
export class AIAnalysisResultDto {
  @IsString()
  decision: 'questions' | 'in_progress';

  @IsString()
  reasoning: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestedActions?: string[];
}
