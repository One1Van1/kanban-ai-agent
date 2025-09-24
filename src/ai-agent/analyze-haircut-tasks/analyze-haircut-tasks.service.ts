import { Injectable } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';
import { GetTaskService } from '../../jira/get-task/get-task.service';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
// import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';
import { AnalyzeHaircutTasksDto } from './analyze-haircut-tasks.dto';
import {
  AnalyzeHaircutTasksResponse,
  HaircutTaskAnalysisResult,
  HaircutTaskDetails,
} from './analyze-haircut-tasks.interface';

@Injectable()
export class AnalyzeHaircutTasksService extends AiBaseService {
  private readonly processingTasks = new Set<string>(); // Защита от дублирования

  constructor(
    getColumnTasksService: GetColumnTasksService,
    moveTaskService: MoveTaskService,
    addTaskCommentService: AddTaskCommentService,
    // checkEntityExistsService: CheckEntityExistsService,
    private readonly getTaskService: GetTaskService,
  ) {
    super(
      getColumnTasksService,
      moveTaskService,
      addTaskCommentService,
      // checkEntityExistsService,
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

        const analysisResult =
          await this.analyzeSpecificHaircutTask(taskDetails);
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

  private async analyzeSpecificHaircutTask(
    task: HaircutTaskDetails,
  ): Promise<HaircutTaskAnalysisResult> {
    // Защита от одновременной обработки одной задачи
    if (this.processingTasks.has(task.key)) {
      this.logger.warn(
        `⚠️ Task ${task.key} is already being processed, skipping`,
      );
      return {
        taskKey: task.key,
        decision: 'skip',
        reason: 'Task is already being processed',
        moved: false,
      };
    }

    this.processingTasks.add(task.key);

    try {
      this.logger.log(`🔍 Analyzing task: ${task.key} - "${task.summary}"`);
      this.logger.log(
        `Task details: description="${task.description}", hasAttachments=${task.hasAttachments}, attachmentCount=${task.attachmentCount}`,
      );

      // Проверяем, связана ли задача со стрижкой
      const isHaircutTask = this.isSpecificHaircutRelated(
        task.summary,
        task.description,
      );

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
      const hasDescription = Boolean(
        task.description && task.description.trim(),
      );
      const hasPhoto = task.hasAttachments;

      this.logger.log(
        `Task ${task.key} completeness check: title=${hasTitle}, description=${hasDescription}, photo=${hasPhoto}`,
      );

      // Полная задача: есть название, описание и фото
      if (hasTitle && hasDescription && hasPhoto) {
        this.logger.log(`Task ${task.key} is COMPLETE - moving to In Progress`);
        try {
          await this.moveTaskService.moveTaskToColumn(task.key, 'In Progress');

          // Проверяем, не добавляли ли уже этот комментарий
          const progressComment = 'Стрижка займёт некоторое время';
          const fullTaskInfo = await this.getTaskService.getTaskByKey(task.key);
          const existingComments =
            (fullTaskInfo as any).fields?.comment?.comments || [];

          const alreadyCommented = existingComments.some(
            (existingComment: any) =>
              existingComment.body?.content?.[0]?.content?.[0]?.text?.includes(
                'займёт минуту',
              ),
          );

          if (!alreadyCommented) {
            await this.addTaskCommentService.addCommentToTask(
              task.key,
              progressComment,
            );
            this.logger.log(
              `✅ Comment added to task ${task.key}: "${progressComment}"`,
            );
          } else {
            this.logger.log(
              `⚠️ Comment already exists for task ${task.key}, skipping`,
            );
          }

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
      this.logger.log(
        `Task ${task.key} is incomplete - moving to Questions with comment`,
      );

      try {
        this.logger.log(`Attempting to move task ${task.key} to Questions...`);
        await this.moveTaskService.moveTaskToColumn(task.key, 'Questions');
        this.logger.log(`✅ Successfully moved task ${task.key} to Questions`);

        const comment = 'Какую именно стрижку ты хочешь?';

        // Проверяем, не добавляли ли мы уже этот комментарий
        this.logger.log(`Checking existing comments for task ${task.key}...`);
        const fullTaskInfo = await this.getTaskService.getTaskByKey(task.key);
        const existingComments =
          (fullTaskInfo as any).fields?.comment?.comments || [];

        const alreadyCommented = existingComments.some((existingComment: any) =>
          existingComment.body?.content?.[0]?.content?.[0]?.text?.includes(
            comment.substring(0, 10),
          ),
        );

        if (!alreadyCommented) {
          this.logger.log(
            `Attempting to add comment to task ${task.key}: "${comment}"`,
          );
          await this.addTaskCommentService.addCommentToTask(task.key, comment);
          this.logger.log(`✅ Successfully added comment to task ${task.key}`);
        } else {
          this.logger.log(
            `⚠️ Comment already exists for task ${task.key}, skipping`,
          );
        }

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
        this.logger.error(
          `❌ Failed to move task ${task.key} to Questions:`,
          error.message,
        );
        this.logger.error(`Error details:`, {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack?.split('\n').slice(0, 3).join('\n'), // First 3 lines of stack
        });
        return {
          taskKey: task.key,
          decision: 'move_to_questions',
          reason: 'Task has only title, missing description and/or photo',
          moved: false,
        };
      }
    } finally {
      // Всегда освобождаем блокировку
      this.processingTasks.delete(task.key);
    }
  }

  private isSpecificHaircutRelated(
    summary: string,
    description: string,
  ): boolean {
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
