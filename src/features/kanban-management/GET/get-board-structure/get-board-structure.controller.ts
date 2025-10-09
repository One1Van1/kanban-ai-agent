import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetBoardStructureService } from './get-board-structure.service';
import { GetBoardStructureRequestDto } from './get-board-structure.request.dto';
import { GetBoardStructureResponseDto } from './get-board-structure.response.dto';
import { ApiGetBoardStructure } from './openapi.decorator';

@Controller('kanban/board')
@ApiTags('GetBoardStructure')
export class GetBoardStructureController {
  constructor(private readonly service: GetBoardStructureService) {}

  @Get('structure')
  @ApiGetBoardStructure()
  async handle(
    @Query() queryDto: GetBoardStructureRequestDto,
  ): Promise<GetBoardStructureResponseDto> {
    return this.service.execute(queryDto);
  }
}
