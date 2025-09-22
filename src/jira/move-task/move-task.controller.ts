import { Controller, Post, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { MoveTaskService } from './move-task.service';
import { MoveTaskDto } from './move-task.dto';
import { MoveTaskResponse } from './move-task.interface';

@ApiTags('tasks')
@Controller('jira')
export class MoveTaskController {
  constructor(private readonly moveTaskService: MoveTaskService) {}

  /**
   * Переместить задачу в другую колонку
   */
  @Post('tasks/:taskKey/move')
  @ApiOperation({
    summary: 'Переместить задачу между колонками',
    description:
      'Перемещает задачу в указанный статус с возможностью добавления комментария',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira (например: KAN-5)',
    example: 'KAN-5',
  })
  @ApiBody({ type: MoveTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Задача успешно перемещена',
    schema: {
      example: {
        success: true,
        taskKey: 'KAN-5',
        fromStatus: 'In Progress',
        toStatus: 'Done',
        transitionId: '51',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации или невозможность перехода',
  })
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
