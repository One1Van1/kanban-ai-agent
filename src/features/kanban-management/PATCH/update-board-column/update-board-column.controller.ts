import { Controller, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBoardColumnService } from './update-board-column.service';
import { UpdateBoardColumnRequestDto } from './update-board-column.request.dto';
import { UpdateBoardColumnResponseDto } from './update-board-column.response.dto';
import { UpdateBoardColumnOpenApi } from './update-board-column.openapi.decorator';

@Controller('kanban/boards/columns')
@ApiTags('UpdateBoardColumn')
export class UpdateBoardColumnController {
  constructor(private readonly service: UpdateBoardColumnService) {}

  @Patch(':id')
  @UpdateBoardColumnOpenApi()
  async updateColumn(
    @Param('id', ParseUUIDPipe) columnId: string,
    @Body() requestDto: UpdateBoardColumnRequestDto,
  ): Promise<UpdateBoardColumnResponseDto> {
    return this.service.updateColumn(columnId, requestDto);
  }
}
