import { Injectable } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';
import { GetTaskService } from '../../jira/get-task/get-task.service';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';
import { AnalyzeHaircutTasksDto } from './analyze-haircut-tasks.dto';
import {
  AnalyzeHaircutTasksResponse,
  HaircutTaskAnalysisResult,
  HaircutTaskDetails,
} from './analyze-haircut-tasks.interface';

@Injectable()
export class AnalyzeHaircutTasksService extends AiBaseService {
  constructor(
    getColumnTasksService: GetColumnTasksService,
    moveTaskService: MoveTaskService,
    addTaskCommentService: AddTaskCommentService,
    checkEntityExistsService: CheckEntityExistsService,
    private readonly getTaskService: GetTaskService,
  ) {
    super(
      getColumnTasksService,
      moveTaskService,
      addTaskCommentService,
      checkEntityExistsService,
    );
  }
  async execute(
    dto: AnalyzeHaircutTasksDto,
  ): Promise<AnalyzeHaircutTasksResponse> {
    this.logger.log(
      `Starting haircut tasks analysis for column: ${dto.sourceColumn || 'New'}`,
    );

    try {
      // Получаем задачи из указанной колонки
      const tasksResponse = await this.getColumnTasksService.getTasksFromColumn(
        dto.sourceColumn || 'New',
        { maxResults: 50 },
      );

      if (!tasksResponse.tasks || tasksResponse.tasks.length === 0) {
        this.logger.log('No tasks found in the specified column');
        return {
          tasksAnalyzed: 0,
          tasksMoved: 0,
          results: [],
        };
      }

      const results: HaircutTaskAnalysisResult[] = [];
      let movedCount = 0;

      // Анализируем каждую задачу
      for (const task of tasksResponse.tasks) {
        // Получаем полную информацию о задаче, включая вложения
        const fullTaskInfo = await this.getTaskService.getTaskByKey(task.key);

        const taskDetails: HaircutTaskDetails = {
          key: task.key,
          summary: task.summary || '',
          description: task.description || '',
          hasAttachments: Boolean(
            fullTaskInfo.fields.attachment &&
              fullTaskInfo.fields.attachment.length > 0,
          ),
          attachmentCount: fullTaskInfo.fields.attachment
            ? fullTaskInfo.fields.attachment.length
            : 0,
        };

        this.logger.log(
          `Task ${task.key}: attachments=${taskDetails.attachmentCount}, hasDesc=${!!taskDetails.description}`,
        );

        const analysisResult = await this.analyzeHaircutTask(taskDetails);
        results.push(analysisResult);

        if (analysisResult.moved) {
          movedCount++;
        }
      }

      this.logger.log(
        `Analysis completed: ${results.length} tasks analyzed, ${movedCount} tasks moved`,
      );

      return {
        tasksAnalyzed: results.length,
        tasksMoved: movedCount,
        results,
      };
    } catch (error) {
      this.logger.error('Error during haircut tasks analysis', error);
      throw error;
    }
  }

  private async analyzeHaircutTask(
    task: HaircutTaskDetails,
  ): Promise<HaircutTaskAnalysisResult> {
    this.logger.log(`Analyzing task: ${task.key} - ${task.summary}`);

    // Проверяем, связана ли задача со стрижкой
    const isHaircutTask = this.isHaircutRelated(task.summary, task.description);

    if (!isHaircutTask) {
      this.logger.log(`Task ${task.key} is not haircut-related, skipping`);
      return {
        taskKey: task.key,
        decision: 'move_to_questions',
        reason: 'Task is not related to haircuts',
        moved: false,
      };
    }

    // Анализируем полноту информации о стрижке
    const hasTitle = Boolean(task.summary);
    const hasDescription = Boolean(task.description && task.description.trim());
    const hasPhoto = task.hasAttachments;

    // Полная задача: есть название, описание и фото
    if (hasTitle && hasDescription && hasPhoto) {
      try {
        await this.moveTaskService.moveTaskToColumn(task.key, 'In Progress');

        // Добавляем комментарий для полной задачи
        const progressComment = 'Стрижка займёт минуту';
        const progressCommentRequest = {
          body: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: progressComment,
                  },
                ],
              },
            ],
          },
        };

        // Используем базовый сервис для добавления комментария
        const httpClient = (this.addTaskCommentService as any).getHttpClient();
        await httpClient.post(
          `/issue/${task.key}/comment`,
          progressCommentRequest,
        );

        this.logger.log(
          `Task ${task.key} moved to In Progress (complete haircut request)`,
        );

        return {
          taskKey: task.key,
          decision: 'move_to_progress',
          reason: 'Task has title, description and photo attachment',
          moved: true,
          commentAdded: progressComment,
        };
      } catch (error) {
        this.logger.error(
          `Failed to move task ${task.key} to In Progress`,
          error,
        );
        return {
          taskKey: task.key,
          decision: 'move_to_progress',
          reason: 'Task has title, description and photo attachment',
          moved: false,
        };
      }
    }

    // Неполная задача: перемещаем в Questions и добавляем комментарий
    try {
      await this.moveTaskService.moveTaskToColumn(task.key, 'Questions');

      const comment = 'Какую именно стрижку ты хочешь?';
      // Используем правильный формат для Jira API (ADF)
      const commentRequest = {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment,
                },
              ],
            },
          ],
        },
      };

      // Используем базовый сервис для добавления комментария
      const httpClient = (this.addTaskCommentService as any).getHttpClient();
      await httpClient.post(`/issue/${task.key}/comment`, commentRequest);

      this.logger.log(
        `Task ${task.key} moved to Questions (incomplete haircut request)`,
      );

      return {
        taskKey: task.key,
        decision: 'move_to_questions',
        reason: 'Task has only title, missing description and/or photo',
        moved: true,
        commentAdded: comment,
      };
    } catch (error) {
      this.logger.error(`Failed to move task ${task.key} to Questions`, error);
      return {
        taskKey: task.key,
        decision: 'move_to_questions',
        reason: 'Task has only title, missing description and/or photo',
        moved: false,
      };
    }
  }

  private isHaircutRelated(summary: string, description: string): boolean {
    const haircutKeywords = [
      'стрижк',
      'haircut',
      'причёск',
      'парикмахер',
      'hair',
      'волос',
      'укладк',
      'стиль',
      'сделай мне',
      'подстриг',
    ];

    const text = `${summary} ${description}`.toLowerCase();
    return haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }
}
