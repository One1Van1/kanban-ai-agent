import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTaskCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Задача выполнена в соответствии с требованиями',
  })
  @IsString()
  comment: string;
}
