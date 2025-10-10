import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetBoardSummaryService } from './get-board-summary.service';
import { GetBoardSummaryRequestDto } from './get-board-summary.request.dto';
import { GetBoardSummaryResponseDto } from './get-board-summary.response.dto';
import { ApiGetBoardSummary } from './openapi.decorator';

@Controller('kanban/board')
@ApiTags('GetBoardSummary')
export class GetBoardSummaryController {
  constructor(private readonly service: GetBoardSummaryService) {}

  @Get('summary')
  @ApiGetBoardSummary()
  async handle(
    @Query() query: GetBoardSummaryRequestDto,
  ): Promise<GetBoardSummaryResponseDto> {
    return this.service.execute(query);
  }
}
