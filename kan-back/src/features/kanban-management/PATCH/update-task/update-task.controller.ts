import { Controller, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTaskService } from './update-task.service';
import { UpdateTaskRequestDto } from './update-task.request.dto';
import { UpdateTaskResponseDto } from './update-task.response.dto';
import { ApiUpdateTask } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('UpdateTask')
export class UpdateTaskController {
  constructor(private readonly service: UpdateTaskService) {}

  @Patch(':id')
  @ApiUpdateTask()
  async handle(
    @Param('id') taskId: string,
    @Body() updateDto: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    return this.service.execute(taskId, updateDto);
  }
}
