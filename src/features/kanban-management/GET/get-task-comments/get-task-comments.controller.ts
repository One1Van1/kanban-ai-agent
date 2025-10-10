import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskCommentsService } from './get-task-comments.service';
import { GetTaskCommentsRequestDto } from './get-task-comments.request.dto';
import { GetTaskCommentsResponseDto } from './get-task-comments.response.dto';
import { ApiGetTaskComments } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('GetTaskComments')
export class GetTaskCommentsController {
  constructor(private readonly service: GetTaskCommentsService) {}

  @Get(':id/comments')
  @ApiGetTaskComments()
  async handle(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Query() query: GetTaskCommentsRequestDto,
  ): Promise<GetTaskCommentsResponseDto> {
    return this.service.execute(taskId, query);
  }
}
