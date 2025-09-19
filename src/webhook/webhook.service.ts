import { Injectable, Logger } from '@nestjs/common';
import { JiraWebhookDto, TaskAnalysisDto } from '../dto';
import { AIAnalysisService } from '../ai-analysis';
import { KanbanService, TaskUpdateRequest } from '../kanban';
import { TaskStatus, AIDecision } from '../types/enums';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly aiAnalysisService: AIAnalysisService,
    private readonly kanbanService: KanbanService,
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

      // Обновляем статус задачи в Jira на основе решения AI
      const updateSuccess = await this.updateTaskStatus(
        payload.issue.key,
        aiResult.decision,
        aiResult.reasoning,
      );

      const result = {
        issueKey: payload.issue.key,
        decision: aiResult.decision,
        reasoning: aiResult.reasoning,
        questions: aiResult.questions,
        suggestedActions: aiResult.suggestedActions,
        statusUpdated: updateSuccess,
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
