import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class TimeValidationWebhookDto {
  @IsNotEmpty()
  @IsString()
  webhookEvent: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @IsOptional()
  issue?: {
    key: string;
    fields?: {
      summary?: string;
      description?: string;
      status?: {
        name: string;
      };
      assignee?: {
        displayName: string;
        emailAddress?: string;
      };
      worklog?: {
        total?: number;
        worklogs?: Array<{
          timeSpentSeconds: number;
          started: string;
          author?: {
            displayName: string;
          };
          comment?: string;
        }>;
      };
      comment?: {
        comments?: Array<{
          body: string;
          author?: {
            displayName: string;
          };
          created?: string;
        }>;
      };
    };
  };

  @IsOptional()
  changelog?: {
    items?: Array<{
      field: string;
      fromString?: string;
      toString?: string;
      to?: string; // добавим альтернативное поле
    }>;
  };

  @IsOptional()
  user?: {
    displayName?: string;
    emailAddress?: string;
  };
}
