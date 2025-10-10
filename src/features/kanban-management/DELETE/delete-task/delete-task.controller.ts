import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { DeleteTaskService } from './delete-task.service';
import { DeleteTaskRequestDto } from './delete-task.request.dto';
import { DeleteTaskResponseDto } from './delete-task.response.dto';
import { DeleteTaskOpenApi } from './delete-task.openapi.decorator';

@Controller('kanban-management')
export class DeleteTaskController {
  constructor(private readonly service: DeleteTaskService) {}

  @Delete('task/:taskId')
  @DeleteTaskOpenApi()
  async deleteTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() requestDto: DeleteTaskRequestDto,
  ): Promise<DeleteTaskResponseDto> {
    return this.service.deleteTask(taskId, requestDto);
  }
}
