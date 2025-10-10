import { Controller, Patch, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReorderBoardColumnsService } from './reorder-board-columns.service';
import { ReorderBoardColumnsRequestDto } from './reorder-board-columns.request.dto';
import { ReorderBoardColumnsResponseDto } from './reorder-board-columns.response.dto';
import { ApiReorderBoardColumns } from './reorder-board-columns.openapi.decorator';

@Controller('kanban-management')
@ApiTags('ReorderBoardColumns')
export class ReorderBoardColumnsController {
  constructor(private readonly service: ReorderBoardColumnsService) {}

  @Patch('board/columns/reorder')
  @ApiReorderBoardColumns()
  async handle(
    @Body() requestDto: ReorderBoardColumnsRequestDto,
  ): Promise<ReorderBoardColumnsResponseDto> {
    return this.service.execute(requestDto);
  }
}
