import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchTasksDto {
  @IsString()
  jql: string;

  @IsOptional()
  @IsNumber()
  maxResults?: number;
}
