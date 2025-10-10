import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTasksByColumnService } from './get-tasks-by-column.service';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';
import { GetTasksByColumnResponseDto } from './get-tasks-by-column.response.dto';
import { ApiGetTasksByColumn } from './openapi.decorator';

@Controller('kanban/columns')
@ApiTags('GetTasksByColumn')
export class GetTasksByColumnController {
  constructor(private readonly service: GetTasksByColumnService) {}

  @Get(':column/tasks')
  @ApiGetTasksByColumn()
  async handle(
    @Param('column') column: string,
    @Query() query: GetTasksByColumnQueryDto,
  ): Promise<GetTasksByColumnResponseDto> {
    return this.service.execute(column, query);
  }
}
