import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignTaskService } from './assign-task.service';
import { AssignTaskRequestDto } from './assign-task.request.dto';
import { AssignTaskResponseDto } from './assign-task.response.dto';
import { ApiAssignTask } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('AssignTask')
export class AssignTaskController {
  constructor(private readonly service: AssignTaskService) {}

  @Post(':id/assign')
  @ApiAssignTask()
  async handle(
    @Param('id') taskId: string,
    @Body() assignDto: AssignTaskRequestDto,
  ): Promise<AssignTaskResponseDto> {
    return this.service.execute(taskId, assignDto);
  }
}
