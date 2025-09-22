import { IsString, IsOptional } from 'class-validator';

export class MoveTaskDto {
  @IsString()
  targetStatus: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
