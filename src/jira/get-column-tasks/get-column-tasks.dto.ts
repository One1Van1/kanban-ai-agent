import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class GetColumnTasksDto {
  @IsOptional()
  @IsNumberString()
  maxResults?: number;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
