import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetBoardColumnsService } from './get-board-columns.service';
import { GetBoardColumnsRequestDto } from './get-board-columns.request.dto';
import { GetBoardColumnsResponseDto } from './get-board-columns.response.dto';
import { ApiGetBoardColumns } from './openapi.decorator';

@Controller('jira')
@ApiTags('GetBoardColumns')
export class GetBoardColumnsController {
  constructor(
    private readonly getBoardColumnsService: GetBoardColumnsService,
  ) {}

  @Get('boards/:boardId/columns')
  @ApiGetBoardColumns()
  async handle(
    @Param('boardId') boardId: string,
  ): Promise<GetBoardColumnsResponseDto> {
    const requestDto: GetBoardColumnsRequestDto = { boardId };
    return this.getBoardColumnsService.execute(requestDto);
  }
}
