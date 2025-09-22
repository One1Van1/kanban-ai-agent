import { Controller, Post, Param, Body } from '@nestjs/common';
import { MoveTaskService } from './move-task.service';
import { MoveTaskDto } from './move-task.dto';
import { MoveTaskResponse } from './move-task.interface';

@Controller('jira')
export class MoveTaskController {
  constructor(private readonly moveTaskService: MoveTaskService) {}

  /**
   * Переместить задачу в другую колонку
   */
  @Post('tasks/:taskKey/move')
  async moveTask(
    @Param('taskKey') taskKey: string,
    @Body() body: MoveTaskDto,
  ): Promise<MoveTaskResponse> {
    return this.moveTaskService.moveTaskToColumn(
      taskKey,
      body.targetStatus,
      body.comment,
    );
  }
}
