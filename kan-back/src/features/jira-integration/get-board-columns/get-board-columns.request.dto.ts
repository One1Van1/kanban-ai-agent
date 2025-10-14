import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetBoardColumnsRequestDto {
  @ApiProperty({
    description: 'Board ID or key',
    example: 'PROJ',
  })
  @IsNotEmpty()
  @IsString()
  boardId: string;
}
