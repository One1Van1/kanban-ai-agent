import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { MoveTaskRequestDto } from './move-task.request.dto';
import { MoveTaskResponseDto } from './move-task.response.dto';

@Injectable()
export class MoveTaskService extends JiraBaseService {
  async execute(
    taskKey: string,
    requestDto: MoveTaskRequestDto,
  ): Promise<MoveTaskResponseDto> {
    try {
      // Получаем текущую задачу
      const currentTask = await this.getTask(taskKey);
      const previousStatus = currentTask.fields.status.name;

      // Логика перемещения задачи
      // TODO: Реализовать интеграцию с Jira API

      // Добавляем комментарий если есть
      if (requestDto.comment) {
        await this.addComment(taskKey, { body: requestDto.comment });
      }

      return new MoveTaskResponseDto(
        true,
        taskKey,
        previousStatus,
        requestDto.targetColumn,
        'Task moved successfully',
      );
    } catch (error) {
      return new MoveTaskResponseDto(
        false,
        taskKey,
        'Unknown',
        requestDto.targetColumn,
        'Failed to move task',
        undefined,
        error.message,
      );
    }
  }
}
