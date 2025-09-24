import { Injectable, Logger, Inject } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';
import { ExecuteHaircutTasksDto } from './execute-haircut-tasks.dto';
import { ExecuteHaircutTasksResponse } from './execute-haircut-tasks.interface';
import { AttachFileService } from '../../jira/attach-file/attach-file.service';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { GetTaskService } from '../../jira/get-task/get-task.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';
import * as path from 'path';

@Injectable()
export class ExecuteHaircutTasksService extends AiBaseService {
  protected readonly logger = new Logger(ExecuteHaircutTasksService.name);
  private readonly processingTasks = new Set<string>(); // Защита от дублирования

  constructor(
    getColumnTasksService: GetColumnTasksService,
    moveTaskService: MoveTaskService,
    addTaskCommentService: AddTaskCommentService,
    private readonly getTaskService: GetTaskService,
    // checkEntityExistsService: CheckEntityExistsService,
    private readonly attachFileService: AttachFileService,
  ) {
    super(
      getColumnTasksService,
      moveTaskService,
      addTaskCommentService,
      // checkEntityExistsService,
    );
  }

  async execute(
    dto: ExecuteHaircutTasksDto,
  ): Promise<ExecuteHaircutTasksResponse> {
    this.logger.log(
      '🚀 Starting haircut tasks execution for column: In Progress',
    );

    try {
      // 1. Получаем задачи из колонки In Progress
      const tasksResult = await this.getColumnTasksService.getTasksFromColumn(
        dto.sourceColumn || 'In Progress',
      );

      let tasksExecuted = 0;
      let tasksCompleted = 0;

      if (tasksResult.tasks.length === 0) {
        this.logger.debug('💤 No tasks found in In Progress column');
        return {
          tasksExecuted: 0,
          tasksCompleted: 0,
          executedTasks: [],
        };
      }

      // 2. Обрабатываем каждую задачу
      for (const task of tasksResult.tasks) {
        this.logger.log(`🎯 Processing task: ${task.key} - ${task.summary}`);

        // Проверяем, является ли задача о стрижке
        if (this.isExecuteHaircutRelated(task.summary, task.description)) {
          tasksExecuted++;

          // Выполняем стрижку (перемещаем в Review + комментарий + фото)
          await this.executeHaircutTask(task.key, task.summary);
          tasksCompleted++;

          this.logger.log(
            `✅ Haircut task ${task.key} completed and moved to Review`,
          );
        }
      }

      this.logger.log(
        `🎉 Haircut execution completed: ${tasksCompleted}/${tasksExecuted} tasks executed`,
      );

      return {
        tasksExecuted,
        tasksCompleted,
        executedTasks: [], // Можно добавить детали выполненных задач
      };
    } catch (error) {
      this.logger.error('❌ Error executing haircut tasks:', error.message);
      throw error;
    }
  }

  /**
   * Проверяет, является ли задача связанной со стрижкой
   */
  private isExecuteHaircutRelated(
    summary: string,
    description?: string,
  ): boolean {
    const text = (summary + ' ' + (description || '')).toLowerCase();
    const haircutKeywords = [
      'стрижка',
      'стрижку',
      'haircut',
      'hair',
      'волосы',
      'парикмахер',
      'barber',
      'прическа',
      'подстричь',
    ];

    return haircutKeywords.some((keyword) => text.includes(keyword));
  }

  /**
   * Выполняет задачу о стрижке: перемещает в Review + добавляет комментарий + фото
   */
  private async executeHaircutTask(
    taskKey: string,
    summary: string,
  ): Promise<void> {
    this.logger.log(`✂️ Executing haircut for task: ${taskKey}`);

    try {
      // 1. Перемещаем задачу в Review
      await this.moveTaskService.moveTaskToColumn(taskKey, 'Review');

      // 2. Сначала прикрепляем фотографию результата стрижки
      const imagePath = path.join(
        process.cwd(),
        'assets',
        'Сделал стрижку.png',
      );

      let attachmentInfo = null;
      try {
        const attachmentResult =
          await this.attachFileService.attachFileFromPath(taskKey, imagePath);
        attachmentInfo = attachmentResult[0]; // Берем первое прикрепление
        this.logger.log(
          `📷 Photo attached to task ${taskKey}: ${attachmentInfo.filename}`,
        );
      } catch (photoError) {
        this.logger.error(
          `❌ Failed to attach photo to task ${taskKey}:`,
          photoError.message,
        );
      }

      // 3. Создаем комментарий с ссылкой на прикрепленное изображение
      let completionComment = 'Стрижка выполнена! Результат готов к проверке.';

      if (attachmentInfo) {
        completionComment = `Стрижка выполнена! ✂️ Сделан стильный андеркат с плавным переходом и текстурированным верхом. 📷 Фото результата: ${attachmentInfo.filename} (${Math.round(attachmentInfo.size / 1024)} KB)`;
      }

      // Проверяем, не добавляли ли уже комментарий о выполнении
      const fullTaskInfo = await this.getTaskService.getTaskByKey(taskKey);
      const existingComments =
        (fullTaskInfo as any).fields?.comment?.comments || [];

      const alreadyCompleted = existingComments.some((existingComment: any) =>
        existingComment.body?.content?.[0]?.content?.[0]?.text?.includes(
          'Стрижка выполнена',
        ),
      );

      if (!alreadyCompleted) {
        // Формируем комментарий в формате ADF (как в analyze-haircut-tasks)
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
                    text: completionComment,
                  },
                ],
              },
            ],
          },
        };

        // Используем прямой httpClient как в рабочем коде
        const httpClient = (this.addTaskCommentService as any).getHttpClient();
        await httpClient.post(`/issue/${taskKey}/comment`, commentRequest);

        this.logger.log(
          `✅ Completion comment added to task ${taskKey}: "${completionComment}"`,
        );
      } else {
        this.logger.log(
          `⚠️ Completion comment already exists for task ${taskKey}, skipping`,
        );
      }

      this.logger.log(`✅ Task ${taskKey} completed with photo and comment`);
    } catch (error) {
      this.logger.error(
        `❌ Error executing haircut task ${taskKey}:`,
        error.message,
      );
      // Не бросаем ошибку, чтобы продолжить обработку других задач
    }
  }
}
