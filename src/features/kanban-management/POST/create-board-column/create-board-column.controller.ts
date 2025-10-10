import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardColumnService } from './create-board-column.service';
import { CreateBoardColumnRequestDto } from './create-board-column.request.dto';
import { CreateBoardColumnResponseDto } from './create-board-column.response.dto';
import { CreateBoardColumnOpenApi } from './create-board-column.openapi.decorator';

@Controller('kanban/boards')
@ApiTags('CreateBoardColumn')
export class CreateBoardColumnController {
  constructor(private readonly service: CreateBoardColumnService) {}

  @Post('columns')
  @CreateBoardColumnOpenApi()
  async createColumn(
    @Body() requestDto: CreateBoardColumnRequestDto,
  ): Promise<CreateBoardColumnResponseDto> {
    return this.service.createColumn(requestDto);
  }
}
