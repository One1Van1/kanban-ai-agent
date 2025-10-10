import { Controller, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoveTaskToColumnService } from './move-task-to-column.service';
import { MoveTaskRequestDto } from './move-task-request.dto';
import { MoveTaskResponseDto } from './move-task-response.dto';
import { ApiMoveTaskToColumn } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('MoveTaskToColumn')
export class MoveTaskToColumnController {
  constructor(private readonly service: MoveTaskToColumnService) {}

  @Patch(':id/move')
  @ApiMoveTaskToColumn()
  async handle(
    @Param('id') taskId: string,
    @Body() moveDto: MoveTaskRequestDto,
  ): Promise<MoveTaskResponseDto> {
    return this.service.execute(taskId, moveDto);
  }
}
