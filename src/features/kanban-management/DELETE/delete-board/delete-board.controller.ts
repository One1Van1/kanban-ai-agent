import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { DeleteBoardService } from './delete-board.service';
import { DeleteBoardRequestDto } from './delete-board.request.dto';
import { DeleteBoardResponseDto } from './delete-board.response.dto';
import { ApiDeleteBoard } from './delete-board.openapi.decorator';

@Controller('kanban-management')
export class DeleteBoardController {
  constructor(private readonly service: DeleteBoardService) {}

  @Delete('board/:boardId')
  @ApiDeleteBoard()
  async deleteBoard(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() requestDto: DeleteBoardRequestDto,
  ): Promise<DeleteBoardResponseDto> {
    return this.service.deleteBoard(boardId, requestDto);
  }
}
