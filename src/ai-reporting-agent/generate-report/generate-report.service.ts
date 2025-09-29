import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as chrono from 'chrono-node';
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
    this.logger.log(`🔍 Parsing date range from: "${description}"`);

    // First try advanced natural language parsing with Chrono
    const chronoResult = this.parseWithChrono(description);
    if (chronoResult) {
      this.logger.log(
        `📅 Chrono parsed: ${chronoResult.startDate} to ${chronoResult.endDate}`,
      );
      return chronoResult;
    }

    // Fallback to manual parsing for specific patterns
    return this.parseWithManualPatterns(description);
  }

  private parseWithChrono(description: string): {
    startDate: string;
    endDate: string;
  } | null {
    const today = new Date();

    this.logger.log(`🔄 Chrono attempting to parse: "${description}"`);

    try {
      // Translate Russian phrases to English for Chrono
      let englishDescription = description
        .replace(/последни[ех]\s*(\d+)\s*дне[йи]/gi, 'last $1 days')
        .replace(/за\s*последни[ех]\s*(\d+)\s*дне[йи]/gi, 'last $1 days')
        .replace(/последний\s*день/gi, 'today')
        .replace(/вчера/gi, 'yesterday')
        .replace(/позавчера/gi, '2 days ago')
        .replace(/прошлую\s*неделю/gi, 'last week')
        .replace(/прошлый\s*месяц/gi, 'last month')
        .replace(/эту\s*неделю/gi, 'this week')
        .replace(/этот\s*месяц/gi, 'this month')
        .replace(/неделю\s*назад/gi, '1 week ago')
        .replace(/месяц\s*назад/gi, '1 month ago')
        .replace(/(\d+)\s*недел[иь]\s*назад/gi, '$1 weeks ago')
        .replace(/(\d+)\s*месяц[а-я]*\s*назад/gi, '$1 months ago');

      this.logger.log(`🔄 Translated to English: "${englishDescription}"`);

      // Special handling for "last week" - should be Monday to Sunday of previous week
      if (
        englishDescription.includes('last week') ||
        description.includes('прошлую неделю')
      ) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate Monday of current week
        const mondayOfCurrentWeek = new Date(currentDate);
        mondayOfCurrentWeek.setDate(
          currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
        );

        // Calculate Monday and Sunday of previous week
        const mondayOfLastWeek = new Date(mondayOfCurrentWeek);
        mondayOfLastWeek.setDate(mondayOfCurrentWeek.getDate() - 7);

        const sundayOfLastWeek = new Date(mondayOfLastWeek);
        sundayOfLastWeek.setDate(mondayOfLastWeek.getDate() + 6);

        this.logger.log(
          `📅 Chrono: Last week range calculated - Monday: ${mondayOfLastWeek.toISOString().split('T')[0]} to Sunday: ${sundayOfLastWeek.toISOString().split('T')[0]}`,
        );

        return {
          startDate: mondayOfLastWeek.toISOString().split('T')[0],
          endDate: sundayOfLastWeek.toISOString().split('T')[0],
        };
      }

      // Try regular Chrono parsing for other patterns
      const parsed = chrono.parse(englishDescription, today);

      if (parsed.length > 0) {
        const result = parsed[0];
        this.logger.log(`📅 Chrono found result: ${result.text}`);

        // Handle range
        if (result.start && result.end) {
          this.logger.log(
            `📅 Chrono found range: ${result.start.date()} to ${result.end.date()}`,
          );
          return {
            startDate: result.start.date().toISOString().split('T')[0],
            endDate: result.end.date().toISOString().split('T')[0],
          };
        }

        // Handle single date
        if (result.start) {
          const date = result.start.date();
          this.logger.log(`📅 Chrono found single date: ${date}`);

          // For "last X days", create a range
          const lastDaysMatch = englishDescription.match(/last\s+(\d+)\s+days/);
          if (lastDaysMatch) {
            const days = parseInt(lastDaysMatch[1]);
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - days);
            return {
              startDate: startDate.toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0],
            };
          }

          // Single day
          const dateStr = date.toISOString().split('T')[0];
          return {
            startDate: dateStr,
            endDate: dateStr,
          };
        }
      } else {
        this.logger.log(`❌ Chrono could not parse: "${englishDescription}"`);
      }
    } catch (error) {
      this.logger.warn(`❌ Chrono parsing failed: ${error.message}`);
    }

    return null;
  }

  private parseWithManualPatterns(description: string): {
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
              const taskDate = new Date(task.fields.created);
              const dayOfWeek = taskDate.toLocaleDateString('ru-RU', {
                weekday: 'long',
              });

              analyses.push({
                taskKey: task.key,
                score,
                summary: this.extractSummaryFromAnalysis(commentText),
                date: task.fields.created,
                dayOfWeek,
                clientDescription:
                  task.fields.description?.content?.[0]?.content?.[0]?.text ||
                  '',
                gender: this.extractGender(
                  commentText,
                  task.fields.summary || '',
                ),
                haircutStyle: this.extractHaircutStyle(
                  commentText,
                  task.fields.summary || '',
                ),
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

    // Гендерный анализ
    const maleAnalyses = analyses.filter((a) => a.gender === 'male');
    const femaleAnalyses = analyses.filter((a) => a.gender === 'female');

    const genderAnalysis = {
      male: {
        count: maleAnalyses.length,
        averageScore:
          maleAnalyses.length > 0
            ? parseFloat(
                (
                  maleAnalyses.reduce((sum, a) => sum + a.score, 0) /
                  maleAnalyses.length
                ).toFixed(1),
              )
            : 0,
        popularStyles: this.extractPopularStyles(maleAnalyses),
      },
      female: {
        count: femaleAnalyses.length,
        averageScore:
          femaleAnalyses.length > 0
            ? parseFloat(
                (
                  femaleAnalyses.reduce((sum, a) => sum + a.score, 0) /
                  femaleAnalyses.length
                ).toFixed(1),
              )
            : 0,
        popularStyles: this.extractPopularStyles(femaleAnalyses),
      },
    };

    // Анализ по дням недели
    const dayOfWeekAnalysis = this.analyzeDaysOfWeek(analyses);

    // Анализ загрузки
    const workloadAnalysis = this.analyzeWorkload(dayOfWeekAnalysis);

    return {
      totalHaircuts,
      averageScore,
      excellentCount,
      goodCount,
      satisfactoryCount,
      poorCount,
      dateRange,
      genderAnalysis,
      dayOfWeekAnalysis,
      workloadAnalysis,
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
    const stats = report.statistics;
    const dayNames = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ];

    let reportText = `📊 **ОТЧЁТ О СТРИЖКАХ**\n`;
    reportText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Основная статистика
    reportText += `📈 **ОБЩАЯ СТАТИСТИКА**\n`;
    reportText += `• Всего стрижек: **${stats.totalHaircuts}**\n`;
    reportText += `• Средняя оценка: **${stats.averageScore}/10**\n`;
    reportText += `• Отличные (9-10): ${stats.excellentCount}\n`;
    reportText += `• Хорошие (7-8): ${stats.goodCount}\n`;
    reportText += `• Удовлетворительные (5-6): ${stats.satisfactoryCount}\n`;
    reportText += `• Требуют улучшения (1-4): ${stats.poorCount}\n\n`;

    // Гендерная аналитика
    reportText += `👥 **АНАЛИЗ ПО ПОЛУ**\n`;
    if (stats.genderAnalysis.male.count > 0) {
      reportText += `👨 Мужчины: ${stats.genderAnalysis.male.count} стрижек (оценка: ${stats.genderAnalysis.male.averageScore}/10)\n`;
      if (stats.genderAnalysis.male.popularStyles.length > 0) {
        reportText += `   Популярные стили: ${stats.genderAnalysis.male.popularStyles.join(', ')}\n`;
      }
    }
    if (stats.genderAnalysis.female.count > 0) {
      reportText += `👩 Женщины: ${stats.genderAnalysis.female.count} стрижек (оценка: ${stats.genderAnalysis.female.averageScore}/10)\n`;
      if (stats.genderAnalysis.female.popularStyles.length > 0) {
        reportText += `   Популярные стили: ${stats.genderAnalysis.female.popularStyles.join(', ')}\n`;
      }
    }
    reportText += `\n`;

    // Анализ по дням недели
    reportText += `📅 **АНАЛИЗ ПО ДНЯМ НЕДЕЛИ**\n`;
    Object.entries(stats.dayOfWeekAnalysis).forEach(([day, data]) => {
      const dayName = dayNames[parseInt(day)];
      const emoji = data.isWeekend ? '🎉' : '💼';
      reportText += `${emoji} ${dayName}: ${data.count} стрижек (оценка: ${data.averageScore}/10)\n`;
    });
    reportText += `\n`;

    // Анализ загрузки
    reportText += `⚡ **АНАЛИЗ ЗАГРУЗКИ**\n`;
    reportText += `🔥 Самый загруженный день: ${dayNames[parseInt(stats.workloadAnalysis.busiestDay)]}\n`;
    reportText += `😴 Самый спокойный день: ${dayNames[parseInt(stats.workloadAnalysis.quietestDay)]}\n`;
    reportText += `📊 Будни vs Выходные:\n`;
    reportText += `   • Будни: ${stats.workloadAnalysis.weekdaysVsWeekends.weekdays.count} (${stats.workloadAnalysis.weekdaysVsWeekends.weekdays.percentage}%)\n`;
    reportText += `   • Выходные: ${stats.workloadAnalysis.weekdaysVsWeekends.weekends.count} (${stats.workloadAnalysis.weekdaysVsWeekends.weekends.percentage}%)\n\n`;

    // Рекомендации
    if (report.recommendations.length > 0) {
      reportText += `💡 **РЕКОМЕНДАЦИИ**\n`;
      report.recommendations.forEach((rec, index) => {
        reportText += `${index + 1}. ${rec}\n`;
      });
      reportText += `\n`;
    }

    reportText += `📅 Отчёт сформирован: ${new Date().toLocaleString('ru-RU')}`;

    return reportText;
  }

  private extractPopularStyles(analyses: HaircutAnalysis[]): string[] {
    if (analyses.length === 0) return [];

    // Извлекаем стили стрижек из описаний
    const styles = new Map<string, number>();

    analyses.forEach((analysis) => {
      if (analysis.haircutStyle) {
        const style = analysis.haircutStyle.toLowerCase();
        styles.set(style, (styles.get(style) || 0) + 1);
      }
    });

    // Возвращаем топ 3 популярных стиля
    return Array.from(styles.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => style);
  }

  private analyzeDaysOfWeek(analyses: HaircutAnalysis[]): {
    [key: string]: {
      count: number;
      averageScore: number;
      isWeekend: boolean;
    };
  } {
    const dayAnalysis: {
      [key: string]: { scores: number[]; count: number; isWeekend: boolean };
    } = {};

    // Инициализируем все дни недели
    for (let i = 0; i < 7; i++) {
      dayAnalysis[i.toString()] = {
        scores: [],
        count: 0,
        isWeekend: i === 0 || i === 6, // воскресенье (0) и суббота (6)
      };
    }

    // Группируем по дням недели
    analyses.forEach((analysis) => {
      const date = new Date(analysis.date);
      const dayOfWeek = date.getDay().toString();

      if (dayAnalysis[dayOfWeek]) {
        dayAnalysis[dayOfWeek].scores.push(analysis.score);
        dayAnalysis[dayOfWeek].count++;
      }
    });

    // Вычисляем средние оценки
    const result: {
      [key: string]: {
        count: number;
        averageScore: number;
        isWeekend: boolean;
      };
    } = {};

    Object.entries(dayAnalysis).forEach(([day, data]) => {
      result[day] = {
        count: data.count,
        averageScore:
          data.scores.length > 0
            ? parseFloat(
                (
                  data.scores.reduce((sum, score) => sum + score, 0) /
                  data.scores.length
                ).toFixed(1),
              )
            : 0,
        isWeekend: data.isWeekend,
      };
    });

    return result;
  }

  private analyzeWorkload(dayOfWeekAnalysis: {
    [key: string]: { count: number; averageScore: number; isWeekend: boolean };
  }): {
    busiestDay: string;
    quietestDay: string;
    weekdaysVsWeekends: {
      weekdays: { count: number; percentage: number };
      weekends: { count: number; percentage: number };
    };
  } {
    let busiestDay = '0';
    let quietestDay = '0';
    let maxCount = -1;
    let minCount = Infinity;

    let weekdaysCount = 0;
    let weekendsCount = 0;
    let totalCount = 0;

    Object.entries(dayOfWeekAnalysis).forEach(([day, data]) => {
      totalCount += data.count;

      if (data.isWeekend) {
        weekendsCount += data.count;
      } else {
        weekdaysCount += data.count;
      }

      if (data.count > maxCount) {
        maxCount = data.count;
        busiestDay = day;
      }

      if (data.count < minCount && data.count > 0) {
        minCount = data.count;
        quietestDay = day;
      }
    });

    const weekdaysPercentage =
      totalCount > 0 ? Math.round((weekdaysCount / totalCount) * 100) : 0;
    const weekendsPercentage =
      totalCount > 0 ? Math.round((weekendsCount / totalCount) * 100) : 0;

    return {
      busiestDay,
      quietestDay,
      weekdaysVsWeekends: {
        weekdays: { count: weekdaysCount, percentage: weekdaysPercentage },
        weekends: { count: weekendsCount, percentage: weekendsPercentage },
      },
    };
  }

  private extractGender(
    commentText: string,
    taskSummary: string,
  ): 'male' | 'female' | 'unknown' {
    // Сначала проверяем, есть ли в комментарии структурированные данные от Claude
    try {
      const jsonMatch = commentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.clientInfo && parsed.clientInfo.gender) {
          const gender = parsed.clientInfo.gender.toLowerCase();
          if (gender.includes('мужской') || gender === 'male') return 'male';
          if (gender.includes('женский') || gender === 'female')
            return 'female';
        }
      }
    } catch (error) {
      // Если не удалось парсить JSON, продолжаем с текстовым анализом
    }

    const text = (commentText + ' ' + taskSummary).toLowerCase();

    // Ключевые слова для определения пола
    const maleKeywords = [
      'мужчина',
      'парень',
      'мужик',
      'клиент',
      'он ',
      'его ',
      'мужской',
      'бородка',
      'усы',
    ];
    const femaleKeywords = [
      'женщина',
      'девушка',
      'дама',
      'клиентка',
      'она ',
      'её ',
      'женский',
      'подруга',
    ];

    let maleScore = 0;
    let femaleScore = 0;

    maleKeywords.forEach((keyword) => {
      if (text.includes(keyword)) maleScore++;
    });

    femaleKeywords.forEach((keyword) => {
      if (text.includes(keyword)) femaleScore++;
    });

    if (maleScore > femaleScore) return 'male';
    if (femaleScore > maleScore) return 'female';
    return 'unknown';
  }

  private extractHaircutStyle(
    commentText: string,
    taskSummary: string,
  ): string {
    // Сначала проверяем, есть ли в комментарии структурированные данные от Claude
    try {
      const jsonMatch = commentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.clientInfo && parsed.clientInfo.haircutStyle) {
          return parsed.clientInfo.haircutStyle;
        }
      }
    } catch (error) {
      // Если не удалось парсить JSON, продолжаем с текстовым анализом
    }

    const text = (commentText + ' ' + taskSummary).toLowerCase();

    // Популярные стили стрижек
    const styles = [
      'каре',
      'боб',
      'пикси',
      'шегги',
      'лесенка',
      'каскад',
      'андеркат',
      'фейд',
      'квифф',
      'помпадур',
      'crop',
      'buzz cut',
      'машинкой',
      'ножницами',
      'короткая',
      'длинная',
      'средняя',
      'челка',
      'без челки',
      'асимметрия',
      'градуировка',
    ];

    for (const style of styles) {
      if (text.includes(style)) {
        return style;
      }
    }

    return 'стандартная';
  }
}
