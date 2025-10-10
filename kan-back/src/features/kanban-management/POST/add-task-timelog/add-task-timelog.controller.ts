import { Controller, Post, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddTaskTimelogService } from './add-task-timelog.service';
import { AddTaskTimelogRequestDto } from './add-task-timelog.request.dto';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';
import { ApiAddTaskTimelog } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('AddTaskTimelog')
export class AddTaskTimelogController {
  constructor(private readonly service: AddTaskTimelogService) {}

  @Post(':id/timelog')
  @ApiAddTaskTimelog()
  async handle(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: AddTaskTimelogRequestDto,
  ): Promise<AddTaskTimelogResponseDto> {
    return this.service.execute(taskId, requestDto);
  }
}
