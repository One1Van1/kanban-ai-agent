import { Injectable } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
import { GetTaskService } from '../../jira/get-task/get-task.service';
import {
  AnalyzeNewHaircutTasksResponse,
  HaircutTaskResult,
} from './analyze-new-haircut-tasks.interface';
import { TaskAnalysisResult } from '../types/ai-agent.interface';

@Injectable()
export class AnalyzeNewHaircutTasksService extends AiBaseService {
  constructor(
    getColumnTasksService: GetColumnTasksService,
    moveTaskService: MoveTaskService,
    addTaskCommentService: AddTaskCommentService,
    private readonly getTaskService: GetTaskService,
  ) {
    super(getColumnTasksService, moveTaskService, addTaskCommentService);
  }

  async analyzeNewHaircutTasks(): Promise<AnalyzeNewHaircutTasksResponse> {
    this.logger.log('✂️ Starting analysis of NEW HAIRCUT TASKS only...');

    try {
      // Получаем все задачи из колонки New
      const newTasks = await this.getColumnTasksService.getTasksFromColumn(
        'New',
        { maxResults: 50 },
      );

      this.logger.log(`Found ${newTasks.tasks.length} tasks in New column`);

      const results: HaircutTaskResult[] = [];
      let tasksMoved = 0;

      // Анализируем каждую задачу, но ТОЛЬКО стрижки
      for (const task of newTasks.tasks) {
        const text = (
          task.summary +
          ' ' +
          (task.description || '')
        ).toLowerCase();

        // Проверяем, является ли задача о стрижке
        if (!this.isHaircutRelated(text)) {
          this.logger.debug(
            `Task ${task.key} is not haircut-related, skipping`,
          );
          continue; // Пропускаем НЕ-стрижки
        }

        this.logger.log(
          `✂️ Processing haircut task: ${task.key} - ${task.summary}`,
        );

        // Получаем полную информацию о задаче, включая вложения
        const fullTaskInfo = await this.getTaskService.getTaskByKey(task.key);

        const hasAttachments = Boolean(
          fullTaskInfo.fields.attachment &&
            fullTaskInfo.fields.attachment.length > 0,
        );

        // Анализируем стрижку
        const analysis = this.analyzeSpecificHaircutTask(
          task.key,
          task.summary,
          task.description,
          hasAttachments,
        );

        // Выполняем решение
        const moved = await this.executeHaircutDecision(analysis, task.key);
        if (moved) tasksMoved++;

        results.push({
          taskKey: task.key,
          decision: analysis.decision,
          reason: analysis.reason,
          moved,
          commentAdded: moved
            ? this.getHaircutComment(analysis.decision)
            : undefined,
        });

        this.logger.log(
          `✂️ Haircut task ${task.key}: ${analysis.decision} - ${moved ? 'MOVED' : 'STAYED'}`,
        );
      }

      const response: AnalyzeNewHaircutTasksResponse = {
        tasksAnalyzed: results.length,
        tasksMoved,
        results,
      };

      this.logger.log(
        `✂️ Haircut analysis complete: ${tasksMoved}/${results.length} haircut tasks moved`,
      );

      return response;
    } catch (error) {
      this.logger.error('✂️ Error analyzing new haircut tasks:', error.message);
      throw error;
    }
  }

  private analyzeSpecificHaircutTask(
    taskKey: string,
    summary: string,
    description?: string,
    hasAttachments = false,
  ): TaskAnalysisResult {
    this.logger.log(`Analyzing specific haircut task: ${taskKey}`);

    // Анализируем полноту информации о стрижке
    const hasTitle = Boolean(summary);
    const hasDescription = Boolean(description && description.trim());

    // Проверяем наличие фото или референсов в тексте
    const fullText = summary + ' ' + (description || '');
    const hasPhotoReference =
      hasAttachments ||
      fullText.toLowerCase().includes('фото') ||
      fullText.toLowerCase().includes('картинк') ||
      fullText.toLowerCase().includes('изображени') ||
      fullText.toLowerCase().includes('как на') ||
      fullText.toLowerCase().includes('такую');

    // Полная задача: есть название, описание и фото/референс
    if (hasTitle && hasDescription && hasPhotoReference) {
      return {
        taskKey,
        isUnderstandable: true,
        decision: 'move_to_progress',
        reason:
          'Complete haircut request: has title, description and photo/reference',
      };
    }

    // Неполная задача: перемещаем в Questions
    return {
      taskKey,
      isUnderstandable: false,
      decision: 'move_to_questions',
      reason:
        'Incomplete haircut request: missing description and/or photo/reference',
    };
  }

  private async executeHaircutDecision(
    analysis: TaskAnalysisResult,
    taskKey: string,
  ): Promise<boolean> {
    try {
      if (analysis.decision === 'move_to_progress') {
        await this.moveTaskService.moveTaskToColumn(taskKey, 'In Progress');
        await this.addTaskCommentService.addCommentToTask(
          taskKey,
          'Стрижка займёт минуту',
        );
        return true;
      } else if (analysis.decision === 'move_to_questions') {
        await this.moveTaskService.moveTaskToColumn(taskKey, 'Questions');
        await this.addTaskCommentService.addCommentToTask(
          taskKey,
          'Какую именно стрижку ты хочешь?',
        );
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to execute haircut decision for ${taskKey}:`,
        error.message,
      );
      return false;
    }
  }

  private getHaircutComment(decision: string): string {
    switch (decision) {
      case 'move_to_progress':
        return 'Стрижка займёт минуту';
      case 'move_to_questions':
        return 'Какую именно стрижку ты хочешь?';
      default:
        return '';
    }
  }
}
