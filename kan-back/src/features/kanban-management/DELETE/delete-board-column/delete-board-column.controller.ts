import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { DeleteBoardColumnService } from './delete-board-column.service';
import { DeleteBoardColumnRequestDto } from './delete-board-column.request.dto';
import { DeleteBoardColumnResponseDto } from './delete-board-column.response.dto';
import { ApiDeleteBoardColumn } from './delete-board-column.openapi.decorator';

@Controller('kanban-management')
export class DeleteBoardColumnController {
  constructor(private readonly service: DeleteBoardColumnService) {}

  @Delete('board-column/:columnId')
  @ApiDeleteBoardColumn()
  async deleteColumn(
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() requestDto: DeleteBoardColumnRequestDto,
  ): Promise<DeleteBoardColumnResponseDto> {
    return this.service.deleteColumn(columnId, requestDto);
  }
}
