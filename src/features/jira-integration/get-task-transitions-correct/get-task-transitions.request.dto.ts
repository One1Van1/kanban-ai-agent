import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskTransitionsRequestDto {
  @ApiProperty({
    description: 'Ключ задачи для получения переходов',
    example: 'KAN-5',
  })
  @IsString()
  taskKey: string;
}
