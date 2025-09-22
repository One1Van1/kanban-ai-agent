import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEntityExistsDto {
  @ApiProperty({
    description: 'Название сущности для проверки',
    example: 'Order',
  })
  @IsString()
  entityName: string;
}
