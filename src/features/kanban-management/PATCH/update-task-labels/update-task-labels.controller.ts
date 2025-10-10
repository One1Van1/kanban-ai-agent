import { Controller, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTaskLabelsService } from './update-task-labels.service';
import { UpdateTaskLabelsRequestDto } from './update-task-labels.request.dto';
import { UpdateTaskLabelsResponseDto } from './update-task-labels.response.dto';
import { ApiUpdateTaskLabels } from './update-task-labels.openapi.decorator';

@Controller('kanban-management')
@ApiTags('UpdateTaskLabels')
export class UpdateTaskLabelsController {
  constructor(private readonly service: UpdateTaskLabelsService) {}

  @Patch('task/:taskId/labels')
  @ApiUpdateTaskLabels()
  async handle(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() requestDto: UpdateTaskLabelsRequestDto,
  ): Promise<UpdateTaskLabelsResponseDto> {
    return this.service.execute(taskId, requestDto);
  }
}
