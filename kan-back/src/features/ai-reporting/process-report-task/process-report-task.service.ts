import { Injectable, Logger } from '@nestjs/common';
import { ProcessReportTaskRequestDto } from './process-report-task.request.dto';
import { ProcessReportTaskResponseDto } from './process-report-task.response.dto';
import { SearchTasksService } from '../../jira-integration/search-tasks-correct/search-tasks.service';
import { AddTaskCommentService } from '../../jira-integration/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../../jira-integration/move-task-correct/move-task.service';
import { GenerateReportService } from '../generate-report/generate-report.service';

@Injectable()
export class ProcessReportTaskService {
  private readonly logger = new Logger(ProcessReportTaskService.name);

  constructor(
    private readonly searchTasksService: SearchTasksService,
    private readonly addTaskCommentService: AddTaskCommentService,
    private readonly moveTaskService: MoveTaskService,
    private readonly generateReportService: GenerateReportService,
  ) {}

  async execute(
    dto: ProcessReportTaskRequestDto,
  ): Promise<ProcessReportTaskResponseDto> {
    this.logger.log(`🎯 Processing report task: ${dto.taskKey}`);

    try {
      // Get task details to extract date range from description
      const taskDetails = await this.searchTasksService.execute({
        jql: `key = "${dto.taskKey}"`,
        startAt: 0,
        maxResults: 1
      });

      if (!taskDetails.issues || taskDetails.issues.length === 0) {
        throw new Error(`Task ${dto.taskKey} not found`);
      }

      const task = taskDetails.issues[0];
      const description =
        this.extractDescriptionText(task.fields.description) || '';
      const assigneeDisplayName = task.fields.assignee?.displayName;

      // Check if assigned to AI-Report-maker
      if (assigneeDisplayName !== 'AI-Report-maker') {
        this.logger.log(
          `⏩ Task ${dto.taskKey} not assigned to AI-Report-maker, skipping`,
        );
        return new ProcessReportTaskResponseDto(
          false,
          `Task ${dto.taskKey} not assigned to AI-Report-maker`,
        );
      }

      // Check if report comment already exists to avoid duplicates
      try {
        const taskWithComments = await this.searchTasksService.execute({
          jql: `key = "${dto.taskKey}"`,
          startAt: 0,
          maxResults: 1
        });
        const existingComments =
          (taskWithComments.issues[0] as any).fields.comment?.comments || [];
        const hasReportComment = existingComments.some((comment: any) => {
          const commentText = this.extractDescriptionText(comment.body) || '';
          return commentText.includes('Отчет готов. Всего стрижек:');
        });

        if (hasReportComment) {
          this.logger.log(
            `⏩ Task ${dto.taskKey} already has a report comment, skipping`,
          );
          return new ProcessReportTaskResponseDto(
            true,
            `Task ${dto.taskKey} already has a report comment`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Could not check existing comments for ${dto.taskKey}, proceeding anyway`,
        );
      }

      // Generate the report
      const report = await this.generateReportService.execute({
        taskKey: dto.taskKey,
        dateRange: description,
        assigneeEmail: assigneeDisplayName,
      });

      // Format and post the report as a comment
      const formattedReport = this.formatReportComment(report);

      this.logger.log(
        `📋 Report ready: ${formattedReport.substring(0, 100)}...`,
      );

      try {
        await this.addTaskCommentService.addCommentToTask(
          dto.taskKey,
          formattedReport,
        );
        this.logger.log(`✅ Comment added to task ${dto.taskKey}`);
      } catch (error) {
        this.logger.error(
          `❌ Failed to add comment to ${dto.taskKey}:`,
          error.response?.data || error.message,
        );
        // Continue with the workflow even if comment fails
      }

      // Move task to Done
      await this.moveTaskService.execute(dto.taskKey, {
        targetColumn: 'Done',
        comment: 'Отчет обработан автоматически'
      });

      const message = `Report task ${dto.taskKey} processed successfully`;
      this.logger.log(`✅ ${message}`);

      return new ProcessReportTaskResponseDto(true, message);
    } catch (error) {
      this.logger.error(
        `❌ Error processing report task ${dto.taskKey}:`,
        error,
      );
      throw error;
    }
  }

  private extractDescriptionText(description: any): string {
    if (typeof description === 'string') {
      return description;
    }

    if (description?.content) {
      return this.extractTextFromContent(description.content);
    }

    return '';
  }

  private extractTextFromContent(content: any[]): string {
    return content
      .map((item) => {
        if (item.type === 'paragraph' && item.content) {
          return item.content
            .map((textItem: any) => textItem.text || '')
            .join('');
        }
        return '';
      })
      .join('\n');
  }

  private formatReportComment(report: any): string {
    const stats = report.statistics;

    let comment = `📊 **ОТЧЕТ О СТРИЖКАХ**\n\n`;
    comment += `**Период:** ${stats.dateRange.startDate} - ${stats.dateRange.endDate}\n\n`;
    comment += `**📈 Общая статистика:**\n`;
    comment += `• Всего стрижек: ${stats.totalHaircuts}\n`;
    comment += `• Средняя оценка: ${stats.averageScore}/10\n`;
    comment += `• Отличные (9-10): ${stats.excellentCount}\n`;
    comment += `• Хорошие (7-8): ${stats.goodCount}\n`;
    comment += `• Удовлетворительные (5-6): ${stats.satisfactoryCount}\n`;
    comment += `• Неудовлетворительные (1-4): ${stats.poorCount}\n\n`;

    if (
      stats.genderAnalysis.male.count > 0 ||
      stats.genderAnalysis.female.count > 0
    ) {
      comment += `**👥 Анализ по полу:**\n`;
      comment += `• Мужчины: ${stats.genderAnalysis.male.count} (средняя оценка: ${stats.genderAnalysis.male.averageScore.toFixed(1)})\n`;
      comment += `• Женщины: ${stats.genderAnalysis.female.count} (средняя оценка: ${stats.genderAnalysis.female.averageScore.toFixed(1)})\n\n`;
    }

    if (Object.keys(stats.dayOfWeekAnalysis).length > 0) {
      comment += `**📅 Нагрузка по дням недели:**\n`;
      Object.entries(stats.dayOfWeekAnalysis).forEach(
        ([day, data]: [string, any]) => {
          comment += `• ${day}: ${data.count} стрижек (средняя оценка: ${data.averageScore.toFixed(1)})\n`;
        },
      );
      comment += `\n`;
    }

    if (report.recommendations && report.recommendations.length > 0) {
      comment += `**💡 Рекомендации:**\n`;
      report.recommendations.forEach((rec: string, index: number) => {
        comment += `${index + 1}. ${rec}\n`;
      });
    }

    comment += `\n*Отчет сгенерирован автоматически: ${new Date().toLocaleString('ru-RU')}*`;

    return comment;
  }
}
