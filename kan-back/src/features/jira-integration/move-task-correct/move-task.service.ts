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

      // Получаем доступные переходы для задачи
      const transitionsResponse = await this.getTaskTransitions(taskKey);

      // Ищем переход в целевой статус
      const targetTransition = transitionsResponse.transitions.find(
        (t: any) =>
          t.to.name.toLowerCase() === requestDto.targetColumn.toLowerCase(),
      );

      if (!targetTransition) {
        throw new Error(
          `Transition to "${requestDto.targetColumn}" not available`,
        );
      }

      // Выполняем переход в Jira
      await this.transitionTask(taskKey, targetTransition.id);

      this.logger.log(
        `✅ Task ${taskKey} moved from "${previousStatus}" to "${requestDto.targetColumn}"`,
      );

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
