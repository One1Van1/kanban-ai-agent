import { Injectable, Logger } from '@nestjs/common';
import { JiraWebhookDto, TaskAnalysisDto } from '../dto';
import { AIAnalysisService } from '../ai-analysis';
import { KanbanService, TaskUpdateRequest } from '../kanban';
import { TaskExecutorService } from '../task-executor/task-executor.service';
import { TaskStatus, AIDecision } from '../types/enums';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly aiAnalysisService: AIAnalysisService,
    private readonly kanbanService: KanbanService,
    private readonly taskExecutorService: TaskExecutorService,
  ) {}

  async processNewIssue(payload: JiraWebhookDto) {
    this.logger.log(`🎯 Processing new issue: ${payload.issue.key}`);

    try {
      // Извлекаем данные о задаче из Jira payload
      const taskData = this.extractTaskData(payload);
      this.logger.log(`📋 Task data extracted: ${taskData.title}`);

      // Отправляем на анализ в AI
      const aiResult = await this.aiAnalysisService.analyzeTask(taskData);
      this.logger.log(
        `🤖 AI analysis complete. Decision: ${aiResult.decision}`,
      );

      // Проверяем, может ли AI агент выполнить задачу автоматически
      let executionResults = null;
      if (aiResult.decision === 'in_progress') {
        this.logger.log(`🚀 Checking if task can be executed automatically...`);

        const executionPlan = this.taskExecutorService.analyzeTaskForExecution(
          payload.issue.key,
          taskData.title,
          taskData.description,
        );

        if (executionPlan) {
          this.logger.log(`✨ Task is executable. Starting execution...`);

          executionResults =
            await this.taskExecutorService.executeTask(executionPlan);

          const allSuccessful = executionResults.every(
            (result) => result.success,
          );

          if (allSuccessful) {
            this.logger.log(`🎉 Task executed successfully!`);

            // TODO: Добавить комментарий с результатами выполнения в будущем
            // const comment = this.generateExecutionComment(executionResults);
            // await this.addCommentToTask(payload.issue.key, comment);
          } else {
            const failedActions = executionResults.filter((r) => !r.success);
            this.logger.warn(
              `⚠️ Some actions failed: ${failedActions.map((a) => a.message).join(', ')}`,
            );
          }
        } else {
          this.logger.log(`📝 Task requires manual implementation`);
        }
      }

      // Обновляем статус задачи в Jira на основе решения AI (если не была выполнена автоматически)
      let updateSuccess = true;
      if (!executionResults || !executionResults.every((r) => r.success)) {
        updateSuccess = await this.updateTaskStatus(
          payload.issue.key,
          aiResult.decision,
          aiResult.reasoning,
        );
      }

      const result = {
        issueKey: payload.issue.key,
        decision: aiResult.decision,
        reasoning: aiResult.reasoning,
        questions: aiResult.questions,
        suggestedActions: aiResult.suggestedActions,
        statusUpdated: updateSuccess,
        executionResults: executionResults,
        originalData: taskData,
      };

      this.logger.log(`✅ Issue processing complete for ${payload.issue.key}`);
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Error processing issue ${payload.issue.key}: ${error.message}`,
      );
      throw error;
    }
  }

  async processUpdatedIssue(payload: JiraWebhookDto) {
    this.logger.log(`🔄 Processing updated issue: ${payload.issue.key}`);

    try {
      // Проверяем, была ли изменена колонка/статус
      const currentStatus = payload.issue.fields.status?.name;
      const changelog = payload.changelog;

      this.logger.log(`Current status: ${currentStatus}`);

      // Проверяем, была ли задача перемещена в колонку "NEW"
      if (this.wasMovedToNewColumn(changelog, currentStatus)) {
        this.logger.log(
          `🎯 Task moved to NEW column. Starting AI processing...`,
        );

        // Извлекаем данные о задаче
        const taskData = this.extractTaskData(payload);
        this.logger.log(`📋 Task data extracted: ${taskData.title}`);

        // Отправляем на анализ и выполнение AI
        const aiResult = await this.aiAnalysisService.analyzeTask(taskData);
        this.logger.log(
          `🤖 AI analysis complete. Decision: ${aiResult.decision}`,
        );

        // Проверяем возможность автоматического выполнения
        let executionResults = null;
        if (aiResult.decision === 'in_progress') {
          const executionPlan =
            this.taskExecutorService.analyzeTaskForExecution(
              payload.issue.key,
              taskData.title,
              taskData.description,
            );

          if (executionPlan) {
            this.logger.log(`✨ Task is executable. Starting execution...`);
            executionResults =
              await this.taskExecutorService.executeTask(executionPlan);

            const allSuccessful = executionResults.every(
              (result) => result.success,
            );
            if (allSuccessful) {
              this.logger.log(`🎉 Task executed successfully!`);
            } else {
              const failedActions = executionResults.filter((r) => !r.success);
              this.logger.warn(
                `⚠️ Some actions failed: ${failedActions.map((a) => a.message).join(', ')}`,
              );
            }
          }
        }

        // Обновляем статус задачи в Jira
        const updateSuccess = await this.updateTaskStatus(
          payload.issue.key,
          aiResult.decision,
          aiResult.reasoning,
        );

        return {
          action: 'ai_processing_triggered',
          issueKey: payload.issue.key,
          decision: aiResult.decision,
          executionResults: executionResults,
          statusUpdated: updateSuccess,
        };
      }

      // Если изменение не касается перехода в NEW колонку
      return {
        action: 'ignored',
        issueKey: payload.issue.key,
        message: 'Status change not relevant for AI processing',
      };
    } catch (error) {
      this.logger.error(
        `❌ Error processing updated issue ${payload.issue.key}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Проверяет, была ли задача перемещена в колонку NEW
   */
  private wasMovedToNewColumn(changelog: any, currentStatus: string): boolean {
    this.logger.log(
      `🔍 Checking if moved to NEW column. Current status: ${currentStatus}`,
    );

    // Проверяем текущий статус (добавляем разные варианты написания)
    const newStatuses = ['NEW', 'New', 'To Do', 'NEW TASK', 'new'];
    if (newStatuses.includes(currentStatus)) {
      this.logger.log(`✅ Task is in NEW status: ${currentStatus}`);
      return true;
    }

    // Проверяем changelog если есть
    if (changelog?.items) {
      this.logger.log(
        `🔍 Checking changelog items: ${JSON.stringify(changelog.items)}`,
      );

      const statusChange = changelog.items.find(
        (item: any) =>
          item.field === 'status' && newStatuses.includes(item.toString),
      );

      if (statusChange) {
        this.logger.log(
          `✅ Found status change to NEW: ${statusChange.fromString} → ${statusChange.toString}`,
        );
        return true;
      }
    }

    this.logger.log(`❌ Task not moved to NEW column`);
    return false;
  }

  /**
   * Обновляет статус задачи в Jira на основе решения AI
   */
  private async updateTaskStatus(
    taskKey: string,
    aiDecision: 'questions' | 'in_progress',
    reasoning: string,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `🔄 Updating task status for ${taskKey} based on AI decision: ${aiDecision}`,
      );

      // Маппинг решений AI к статусам Jira
      const statusMapping: Record<'questions' | 'in_progress', TaskStatus> = {
        questions: TaskStatus.QUESTIONS,
        in_progress: TaskStatus.IN_PROGRESS,
      };

      const targetStatus = statusMapping[aiDecision];

      if (!targetStatus) {
        this.logger.warn(`⚠️ Unknown AI decision: ${aiDecision}`);
        return false;
      }

      // Формируем комментарий с обоснованием AI
      const comment = `🤖 **AI Analysis Result**

**Decision:** ${aiDecision}
**Reasoning:** ${reasoning}

Task status automatically updated by Kanban AI Agent.`;

      const updateRequest: TaskUpdateRequest = {
        taskKey,
        newStatus: targetStatus,
        comment,
      };

      const success = await this.kanbanService.updateTaskStatus(updateRequest);

      if (success) {
        this.logger.log(
          `✅ Task ${taskKey} status successfully updated to ${targetStatus}`,
        );
      } else {
        this.logger.warn(`⚠️ Failed to update task ${taskKey} status`);
      }

      return success;
    } catch (error) {
      this.logger.error(
        `❌ Failed to update task status for ${taskKey}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Извлекает данные задачи из Jira webhook payload
   */
  private extractTaskData(payload: JiraWebhookDto): TaskAnalysisDto {
    const issue = payload.issue;

    return {
      title: issue.fields.summary,
      description: issue.fields.description || '',
      context: `Status: ${issue.fields.status?.name || 'Unknown'}`,
      priority: issue.fields.priority?.name,
      labels: issue.fields.labels || [],
    };
  }

  /**
   * Проверяет корректность webhook payload
   */
  validatePayload(payload: any): boolean {
    try {
      if (!payload?.issue?.key) {
        this.logger.warn('⚠️ Invalid payload: missing issue key');
        return false;
      }

      if (!payload?.issue?.fields?.summary) {
        this.logger.warn('⚠️ Invalid payload: missing issue summary');
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('❌ Error validating payload:', error);
      return false;
    }
  }
}
