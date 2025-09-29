import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GenerateReportDto,
  GeneratedReport,
  ReportStatistics,
  HaircutAnalysis,
} from './generate-report.dto';
import { SearchTasksService } from '../../jira/search-tasks/search-tasks.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';

@Injectable()
export class GenerateReportService {
  private readonly logger = new Logger(GenerateReportService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly searchTasksService: SearchTasksService,
    private readonly addTaskCommentService: AddTaskCommentService,
    private readonly moveTaskService: MoveTaskService,
  ) {}

  async generateReport(dto: GenerateReportDto): Promise<GeneratedReport> {
    this.logger.log(`🎯 Starting report generation for task: ${dto.taskKey}`);

    try {
      // 1. Parse date range from description
      const dateRange = this.parseDateRange(dto.dateRange);
      this.logger.log(
        `📅 Parsed date range: ${dateRange.startDate} to ${dateRange.endDate}`,
      );

      // 2. Search for haircut tasks in the date range
      const haircutTasks = await this.findHaircutTasks(dateRange);
      this.logger.log(
        `🔍 Found ${haircutTasks.length} haircut tasks in date range`,
      );

      // 3. Extract Claude analyses from the tasks
      const analyses = await this.extractClaudeAnalyses(haircutTasks);
      this.logger.log(`🧠 Extracted ${analyses.length} Claude analyses`);

      // 4. Generate statistics
      const statistics = this.calculateStatistics(analyses, dateRange);

      // 5. Generate recommendations
      const recommendations = this.generateRecommendations(
        analyses,
        statistics,
      );

      // 6. Create the final report
      const report: GeneratedReport = {
        statistics,
        detailedAnalysis: analyses,
        recommendations,
        reportDate: new Date().toISOString(),
      };

      this.logger.log(`✅ Report generated successfully for ${dto.taskKey}`);
      return report;
    } catch (error) {
      this.logger.error(
        `❌ Error generating report for ${dto.taskKey}:`,
        error,
      );
      throw error;
    }
  }

  async processReportTask(taskKey: string): Promise<void> {
    this.logger.log(`🎯 Processing report task: ${taskKey}`);

    try {
      // Get task details to extract date range from description
      const taskDetails = await this.searchTasksService.searchTasksByJql(
        `key = ${taskKey}`,
        1,
      );

      if (!taskDetails.issues || taskDetails.issues.length === 0) {
        throw new Error(`Task ${taskKey} not found`);
      }

      const task = taskDetails.issues[0];
      const description =
        this.extractDescriptionText(task.fields.description) || '';
      const assigneeDisplayName = task.fields.assignee?.displayName;

      // Check if assigned to AI-Report-maker
      if (assigneeDisplayName !== 'AI-Report-maker') {
        this.logger.log(
          `⏩ Task ${taskKey} not assigned to AI-Report-maker, skipping`,
        );
        return;
      }

      // Check if report comment already exists to avoid duplicates
      try {
        const taskWithComments = await this.searchTasksService.searchTasksByJql(
          `key = ${taskKey}`,
          1,
        );
        const existingComments =
          (taskWithComments.issues[0] as any).fields.comment?.comments || [];
        const hasReportComment = existingComments.some((comment: any) => {
          const commentText = this.extractDescriptionText(comment.body) || '';
          return commentText.includes('Отчет готов. Всего стрижек:');
        });

        // Re-enable duplicate check
        if (hasReportComment) {
          this.logger.log(
            `⏩ Task ${taskKey} already has a report comment, skipping`,
          );
          return;
        }
      } catch (error) {
        this.logger.warn(
          `Could not check existing comments for ${taskKey}, proceeding anyway`,
        );
      }

      // Generate the report
      const report = await this.generateReport({
        taskKey,
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
          taskKey,
          formattedReport,
        );
        this.logger.log(`✅ Comment added to task ${taskKey}`);
      } catch (error) {
        this.logger.error(
          `❌ Failed to add comment to ${taskKey}:`,
          error.response?.data || error.message,
        );
        // Continue with the workflow even if comment fails
      }

      // Move task to Done
      await this.moveTaskService.moveTaskToColumn(taskKey, 'Done');

      this.logger.log(`✅ Report task ${taskKey} completed successfully`);
    } catch (error) {
      this.logger.error(`❌ Error processing report task ${taskKey}:`, error);

      // ВРЕМЕННО: пропускаем добавление комментария об ошибке
      this.logger.log(`📋 Error details: ${error.message}`);
      // await this.addTaskCommentService.addComment(taskKey, {
      //   body: `❌ Ошибка при генерации отчета: ${error.message}`,
      // });

      throw error;
    }
  }

  private parseDateRange(description: string): {
    startDate: string;
    endDate: string;
  } {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Normalize text for easier parsing
    const normalizedDesc = description.toLowerCase().trim();

    this.logger.log(`🔍 Parsing date range from: "${description}"`);

    // Parse "последние X дней" or "last X days"
    const lastDaysRegex =
      /(?:последни[ех]\s*|last\s*)(\d+)\s*(?:дне[йи]|день|days?)/i;
    const lastDaysMatch = normalizedDesc.match(lastDaysRegex);
    if (lastDaysMatch) {
      const days = parseInt(lastDaysMatch[1]);
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - days);
      this.logger.log(`📅 Found "последние ${days} дней" pattern`);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      };
    }

    // Parse "за X дней" or "for X days"
    const forDaysRegex = /(?:за\s*|for\s*)(\d+)\s*(?:дне[йи]|день|days?)/i;
    const forDaysMatch = normalizedDesc.match(forDaysRegex);
    if (forDaysMatch) {
      const days = parseInt(forDaysMatch[1]);
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - days);
      this.logger.log(`📅 Found "за ${days} дней" pattern`);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      };
    }

    // Parse "последний день" or "last day"
    if (
      normalizedDesc.includes('последний день') ||
      normalizedDesc.includes('last day')
    ) {
      this.logger.log(`📅 Found "последний день" pattern`);
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      };
    }

    // Basic parsing patterns for relative dates
    if (
      normalizedDesc.includes('вчера') ||
      normalizedDesc.includes('yesterday')
    ) {
      if (normalizedDesc.includes('до') || normalizedDesc.includes('to')) {
        this.logger.log(`📅 Found "вчера до сегодня" pattern`);
        return {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        };
      }
      this.logger.log(`📅 Found "вчера" pattern`);
      return {
        startDate: yesterday.toISOString().split('T')[0],
        endDate: yesterday.toISOString().split('T')[0],
      };
    }

    if (normalizedDesc.includes('неделя') || normalizedDesc.includes('week')) {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      this.logger.log(`📅 Found "неделя" pattern`);
      return {
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      };
    }

    // Extract specific dates using regex (DD.MM.YYYY or DD/MM/YYYY)
    const dateRegex = /(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/g;
    const dates: string[] = [];
    let match;
    while ((match = dateRegex.exec(description)) !== null) {
      const [, day, month, year] = match;
      dates.push(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }

    if (dates.length >= 2) {
      this.logger.log(
        `📅 Found specific date range: ${dates[0]} to ${dates[1]}`,
      );
      return {
        startDate: dates[0],
        endDate: dates[1],
      };
    }

    if (dates.length === 1) {
      this.logger.log(`📅 Found single specific date: ${dates[0]}`);
      return {
        startDate: dates[0],
        endDate: dates[0],
      };
    }

    // Default to last 7 days
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    this.logger.log(`📅 Using default: последние 7 дней`);
    return {
      startDate: weekAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  }

  private async findHaircutTasks(dateRange: {
    startDate: string;
    endDate: string;
  }) {
    // Search ALL haircut tasks with status Done, then filter by AI agent comment date
    const jql = `project = KAN AND summary ~ "стрижк*" AND status = Done`;

    this.logger.log(
      `🔍 Searching ALL completed haircut tasks with JQL: ${jql}`,
    );

    const searchResult = await this.searchTasksService.searchTasksByJql(
      jql,
      200, // Increased limit to get more tasks
    );

    this.logger.log(
      `📊 Found ${searchResult.issues?.length || 0} total completed haircut tasks`,
    );

    // Filter tasks by AI agent comment date
    const filteredTasks = [];
    const startDate = new Date(dateRange.startDate + 'T00:00:00.000Z');
    const endDate = new Date(dateRange.endDate + 'T23:59:59.999Z');

    this.logger.log(
      `🔍 Filtering tasks by AI agent comment date range: ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    for (const task of searchResult.issues || []) {
      const comments = (task.fields as any).comment?.comments || [];

      // Find AI agent analysis comment
      for (const comment of comments) {
        const commentText = this.extractTextFromComment(comment.body);
        const commentDate = new Date(comment.created);

        // Check if this is an AI agent analysis comment within date range
        if (
          (commentText.includes('🤖') ||
            commentText.includes('АНАЛИЗ CLAUDE') ||
            commentText.includes('РЕЗУЛЬТАТ АНАЛИЗА') ||
            commentText.includes('✅ Анализ завершён')) &&
          commentDate >= startDate &&
          commentDate <= endDate
        ) {
          this.logger.log(
            `✅ Task ${task.key}: AI analysis found on ${commentDate.toISOString()}`,
          );
          filteredTasks.push(task);
          break; // Found AI analysis in date range, no need to check other comments
        }
      }
    }

    this.logger.log(
      `🎯 Filtered to ${filteredTasks.length} tasks with AI analysis in date range`,
    );

    return filteredTasks;
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

  private async extractClaudeAnalyses(
    tasks: any[],
  ): Promise<HaircutAnalysis[]> {
    const analyses: HaircutAnalysis[] = [];

    this.logger.log(`🔍 Analyzing ${tasks.length} tasks for Claude comments`);

    for (const task of tasks) {
      try {
        // Get task comments to find Claude analysis
        const comments = task.fields.comment?.comments || [];

        this.logger.log(
          `📋 Task ${task.key}: found ${comments.length} comments`,
        );

        for (const comment of comments) {
          const commentText = this.extractTextFromComment(comment.body);

          this.logger.log(
            `💬 Comment preview: ${commentText.substring(0, 100)}...`,
          );

          // Look for Claude analysis pattern - Updated patterns to match actual comments
          if (
            commentText.includes('🤖') ||
            commentText.includes('АНАЛИЗ CLAUDE') ||
            commentText.includes('АНАЛИЗ СТРИЖКИ') ||
            commentText.includes('Claude Analysis') ||
            commentText.includes('Score:') ||
            commentText.includes('Оценка:') ||
            commentText.includes('РЕЗУЛЬТАТ АНАЛИЗА')
          ) {
            this.logger.log(
              `🎯 Found potential Claude analysis in ${task.key}`,
            );

            // Enhanced score extraction patterns
            let scoreMatch = commentText.match(
              /⭐\s*\*?Общая оценка\*?\s*:\s*(\d+)\/10/i,
            );
            if (!scoreMatch) {
              scoreMatch = commentText.match(/Общая оценка:\s*(\d+)\/10/i);
            }
            if (!scoreMatch) {
              scoreMatch = commentText.match(/Score:\s*(\d+)\/10/i);
            }
            if (!scoreMatch) {
              scoreMatch = commentText.match(/(\d+)\/10/);
            }

            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

            this.logger.log(
              `📊 Extracted score: ${score} from pattern: ${scoreMatch ? scoreMatch[0] : 'not found'}`,
            );

            if (score > 0) {
              analyses.push({
                taskKey: task.key,
                score,
                summary: this.extractSummaryFromAnalysis(commentText),
                date: task.fields.created,
                clientDescription:
                  task.fields.description?.content?.[0]?.content?.[0]?.text ||
                  '',
              });
              this.logger.log(
                `✅ Added analysis for ${task.key} with score ${score}`,
              );
              break; // Found analysis for this task
            }
          }
        }
      } catch (error) {
        this.logger.warn(
          `Failed to extract analysis from task ${task.key}:`,
          error,
        );
      }
    }

    this.logger.log(`🧠 Total analyses extracted: ${analyses.length}`);
    return analyses;
  }

  private extractTextFromComment(commentBody: any): string {
    if (typeof commentBody === 'string') {
      return commentBody;
    }

    if (commentBody?.content) {
      return this.extractTextFromContent(commentBody.content);
    }

    return '';
  }

  private extractTextFromContent(content: any[]): string {
    let text = '';

    for (const item of content) {
      if (item.type === 'paragraph' && item.content) {
        for (const textItem of item.content) {
          if (textItem.type === 'text' && textItem.text) {
            text += textItem.text + ' ';
          }
        }
      }
    }

    return text;
  }

  private extractSummaryFromAnalysis(analysisText: string): string {
    // Extract key points from Claude analysis
    const lines = analysisText.split('\n');
    const summaryLines = lines
      .filter(
        (line) =>
          line.includes('✅') ||
          line.includes('❌') ||
          line.includes('💡') ||
          line.includes('Оценка') ||
          line.includes('Score'),
      )
      .slice(0, 3);

    return summaryLines.join('. ') || 'Анализ выполнен';
  }

  private calculateStatistics(
    analyses: HaircutAnalysis[],
    dateRange: any,
  ): ReportStatistics {
    const totalHaircuts = analyses.length;
    const averageScore =
      totalHaircuts > 0
        ? parseFloat(
            (
              analyses.reduce((sum, a) => sum + a.score, 0) / totalHaircuts
            ).toFixed(1),
          )
        : 0;

    const excellentCount = analyses.filter((a) => a.score >= 9).length;
    const goodCount = analyses.filter(
      (a) => a.score >= 7 && a.score < 9,
    ).length;
    const satisfactoryCount = analyses.filter(
      (a) => a.score >= 5 && a.score < 7,
    ).length;
    const poorCount = analyses.filter((a) => a.score < 5).length;

    return {
      totalHaircuts,
      averageScore,
      excellentCount,
      goodCount,
      satisfactoryCount,
      poorCount,
      dateRange,
    };
  }

  private generateRecommendations(
    analyses: HaircutAnalysis[],
    statistics: ReportStatistics,
  ): string[] {
    const recommendations: string[] = [];

    if (statistics.averageScore < 6) {
      recommendations.push(
        '🎯 Средняя оценка ниже 6/10 - необходимо улучшить качество стрижек',
      );
    }

    if (statistics.poorCount > 0) {
      recommendations.push(
        `⚠️ ${statistics.poorCount} стрижек получили низкую оценку - требует внимания`,
      );
    }

    if (statistics.excellentCount / statistics.totalHaircuts > 0.5) {
      recommendations.push(
        '🏆 Отличная работа! Более половины стрижек получили высокие оценки',
      );
    }

    if (statistics.totalHaircuts === 0) {
      recommendations.push('📊 За указанный период стрижки не найдены');
    }

    // Add general recommendations
    recommendations.push(
      '💡 Продолжайте следить за качеством и техникой выполнения',
    );

    return recommendations;
  }

  private formatReportComment(report: GeneratedReport): string {
    return `Отчет готов. Всего стрижек: ${report.statistics.totalHaircuts}`;
  }
}
