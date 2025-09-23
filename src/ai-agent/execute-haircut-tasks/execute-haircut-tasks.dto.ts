import { IsOptional, IsString } from 'class-validator';

export class ExecuteHaircutTasksDto {
  @IsOptional()
  @IsString()
  sourceColumn?: string;
}
