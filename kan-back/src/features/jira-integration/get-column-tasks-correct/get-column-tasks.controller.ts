import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetColumnTasksService } from './get-column-tasks.service';
import { GetColumnTasksRequestDto } from './get-column-tasks.request.dto';
import { GetColumnTasksResponseDto } from './get-column-tasks.response.dto';
import { ApiGetColumnTasks } from './openapi.decorator';

@Controller('jira/columns')
@ApiTags('GetColumnTasks')
export class GetColumnTasksController {
  constructor(private readonly service: GetColumnTasksService) {}

  @Get(':columnStatus/tasks')
  @ApiGetColumnTasks()
  async handle(
    @Param('columnStatus') columnStatus: string,
    @Query() query: Omit<GetColumnTasksRequestDto, 'columnStatus'>,
  ): Promise<GetColumnTasksResponseDto> {
    const requestDto = new GetColumnTasksRequestDto();
    requestDto.columnStatus = columnStatus;
    requestDto.maxResults = query.maxResults;
    requestDto.assignee = query.assignee;
    requestDto.priority = query.priority;

    return this.service.execute(requestDto);
  }
}
