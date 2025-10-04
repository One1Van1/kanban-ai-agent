import { IsString } from 'class-validator';

export class GetTaskDto {
  @IsString()
  taskKey: string;
}
