import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as chrono from 'chrono-node';
import { GenerateReportRequestDto } from './generate-report.request.dto';
import {
  GenerateReportResponseDto,
  ReportStatistics,
  HaircutAnalysis,
} from './generate-report.response.dto';
import { SearchTasksService } from '../../../jira/search-tasks/search-tasks.service';

@Injectable()
export class GenerateReportService {
  private readonly logger = new Logger(GenerateReportService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly searchTasksService: SearchTasksService,
  ) {}

  async execute(
    dto: GenerateReportRequestDto,
  ): Promise<GenerateReportResponseDto> {
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
      const report = new GenerateReportResponseDto(
        statistics,
        analyses,
        recommendations,
        new Date().toISOString(),
      );

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

  private parseDateRange(dateRangeText: string): {
    startDate: string;
    endDate: string;
  } {
    const now = new Date();
    const moscowOffset = 3 * 60; // UTC+3 в минутах
    const localTime = new Date(now.getTime() + moscowOffset * 60 * 1000);

    // Обработка относительных дат
    if (dateRangeText.includes('сегодня') || dateRangeText.includes('today')) {
      const today = localTime.toISOString().split('T')[0];
      return { startDate: today, endDate: today };
    }

    if (
      dateRangeText.includes('вчера') ||
      dateRangeText.includes('yesterday')
    ) {
      const yesterday = new Date(localTime);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      return { startDate: yesterdayStr, endDate: yesterdayStr };
    }

    // Парсинг с chrono-node
    const parsedDates = chrono.parse(dateRangeText);

    if (parsedDates.length >= 2) {
      const startDate = parsedDates[0].start.date().toISOString().split('T')[0];
      const endDate = parsedDates[1].start.date().toISOString().split('T')[0];
      return { startDate, endDate };
    } else if (parsedDates.length === 1) {
      const date = parsedDates[0].start.date().toISOString().split('T')[0];
      return { startDate: date, endDate: date };
    }

    // По умолчанию - последние 7 дней
    const endDate = localTime.toISOString().split('T')[0];
    const startDate = new Date(localTime);
    startDate.setDate(startDate.getDate() - 7);
    const startDateStr = startDate.toISOString().split('T')[0];

    return { startDate: startDateStr, endDate };
  }

  private async findHaircutTasks(dateRange: {
    startDate: string;
    endDate: string;
  }) {
    const jql = `created >= "${dateRange.startDate}" AND created <= "${dateRange.endDate}" AND summary ~ "стрижк*" OR summary ~ "haircut*" OR summary ~ "причёск*" OR summary ~ "hair*" OR summary ~ "волос*" OR summary ~ "маникюр*"`;

    const searchResult = await this.searchTasksService.searchTasksByJql(jql);
    return searchResult.issues || [];
  }

  private async extractClaudeAnalyses(
    tasks: any[],
  ): Promise<HaircutAnalysis[]> {
    const analyses: HaircutAnalysis[] = [];

    for (const task of tasks) {
      try {
        const comments = task.fields?.comment?.comments || [];
        const claudeComment = comments.find((comment: any) => {
          const bodyText = this.extractCommentText(comment.body);
          return (
            bodyText.includes('🤖 **AI АНАЛИЗ СТРИЖКИ**') ||
            bodyText.includes('AI ANALYSIS OF HAIRCUT')
          );
        });

        if (claudeComment) {
          const analysis = this.parseClaudeAnalysis(claudeComment, task);
          if (analysis) {
            analyses.push(analysis);
          }
        }
      } catch (error) {
        this.logger.warn(
          `Failed to extract analysis from task ${task.key}:`,
          error,
        );
      }
    }

    return analyses;
  }

  private extractCommentText(body: any): string {
    if (typeof body === 'string') {
      return body;
    }

    if (body?.content) {
      return this.extractTextFromContent(body.content);
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

  private parseClaudeAnalysis(comment: any, task: any): HaircutAnalysis | null {
    try {
      const bodyText = this.extractCommentText(comment.body);

      // Extract score
      const scoreMatch = bodyText.match(/(\d+)\/10/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      // Extract gender
      let gender: 'male' | 'female' | 'unknown' = 'unknown';
      if (
        bodyText.includes('Пол: Мужской') ||
        bodyText.includes('Gender: Male')
      ) {
        gender = 'male';
      } else if (
        bodyText.includes('Пол: Женский') ||
        bodyText.includes('Gender: Female')
      ) {
        gender = 'female';
      }

      // Extract style
      const styleMatch =
        bodyText.match(/Стиль: (.+)/i) || bodyText.match(/Style: (.+)/i);
      const haircutStyle = styleMatch ? styleMatch[1].trim() : undefined;

      const createdDate = new Date(task.fields.created);
      const dayOfWeek = createdDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
      });

      return {
        taskKey: task.key,
        score,
        summary: task.fields.summary,
        date: createdDate.toISOString().split('T')[0],
        dayOfWeek,
        gender,
        haircutStyle,
      };
    } catch (error) {
      this.logger.warn(`Failed to parse Claude analysis:`, error);
      return null;
    }
  }

  private calculateStatistics(
    analyses: HaircutAnalysis[],
    dateRange: any,
  ): ReportStatistics {
    const totalHaircuts = analyses.length;
    const averageScore =
      totalHaircuts > 0
        ? analyses.reduce((sum, a) => sum + a.score, 0) / totalHaircuts
        : 0;

    const excellentCount = analyses.filter((a) => a.score >= 9).length;
    const goodCount = analyses.filter(
      (a) => a.score >= 7 && a.score < 9,
    ).length;
    const satisfactoryCount = analyses.filter(
      (a) => a.score >= 5 && a.score < 7,
    ).length;
    const poorCount = analyses.filter((a) => a.score < 5).length;

    // Gender analysis
    const maleAnalyses = analyses.filter((a) => a.gender === 'male');
    const femaleAnalyses = analyses.filter((a) => a.gender === 'female');

    const genderAnalysis = {
      male: {
        count: maleAnalyses.length,
        averageScore:
          maleAnalyses.length > 0
            ? maleAnalyses.reduce((sum, a) => sum + a.score, 0) /
              maleAnalyses.length
            : 0,
        popularStyles: this.getPopularStyles(maleAnalyses),
      },
      female: {
        count: femaleAnalyses.length,
        averageScore:
          femaleAnalyses.length > 0
            ? femaleAnalyses.reduce((sum, a) => sum + a.score, 0) /
              femaleAnalyses.length
            : 0,
        popularStyles: this.getPopularStyles(femaleAnalyses),
      },
    };

    // Day of week analysis
    const dayOfWeekAnalysis: {
      [key: string]: {
        count: number;
        averageScore: number;
        isWeekend: boolean;
      };
    } = {};
    const weekends = ['суббота', 'воскресенье'];

    analyses.forEach((analysis) => {
      if (!dayOfWeekAnalysis[analysis.dayOfWeek]) {
        dayOfWeekAnalysis[analysis.dayOfWeek] = {
          count: 0,
          averageScore: 0,
          isWeekend: weekends.includes(analysis.dayOfWeek.toLowerCase()),
        };
      }
      dayOfWeekAnalysis[analysis.dayOfWeek].count++;
    });

    // Calculate averages for each day
    Object.keys(dayOfWeekAnalysis).forEach((day) => {
      const dayAnalyses = analyses.filter((a) => a.dayOfWeek === day);
      dayOfWeekAnalysis[day].averageScore =
        dayAnalyses.length > 0
          ? dayAnalyses.reduce((sum, a) => sum + a.score, 0) /
            dayAnalyses.length
          : 0;
    });

    // Workload analysis
    const dayCounts = Object.entries(dayOfWeekAnalysis).map(([day, data]) => ({
      day,
      count: data.count,
    }));
    const busiestDay = dayCounts.reduce(
      (max, current) => (current.count > max.count ? current : max),
      { day: '', count: 0 },
    );
    const quietestDay = dayCounts.reduce(
      (min, current) => (current.count < min.count ? current : min),
      { day: '', count: Infinity },
    );

    const weekdaysCount = analyses.filter(
      (a) => !weekends.includes(a.dayOfWeek.toLowerCase()),
    ).length;
    const weekendsCount = analyses.filter((a) =>
      weekends.includes(a.dayOfWeek.toLowerCase()),
    ).length;

    const workloadAnalysis = {
      busiestDay: busiestDay.day,
      quietestDay: quietestDay.day,
      weekdaysVsWeekends: {
        weekdays: {
          count: weekdaysCount,
          percentage:
            totalHaircuts > 0
              ? Math.round((weekdaysCount / totalHaircuts) * 100)
              : 0,
        },
        weekends: {
          count: weekendsCount,
          percentage:
            totalHaircuts > 0
              ? Math.round((weekendsCount / totalHaircuts) * 100)
              : 0,
        },
      },
    };

    return {
      totalHaircuts,
      averageScore: Math.round(averageScore * 100) / 100,
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

  private getPopularStyles(analyses: HaircutAnalysis[]): string[] {
    const styles = analyses
      .map((a) => a.haircutStyle)
      .filter((style): style is string => Boolean(style));

    const styleCounts = styles.reduce(
      (acc, style) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(styleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([style]) => style);
  }

  private generateRecommendations(
    analyses: HaircutAnalysis[],
    statistics: ReportStatistics,
  ): string[] {
    const recommendations: string[] = [];

    // Quality recommendations
    if (statistics.averageScore < 7) {
      recommendations.push(
        'Средняя оценка ниже 7. Рекомендуется усилить контроль качества работы.',
      );
    }

    if (statistics.poorCount > statistics.totalHaircuts * 0.2) {
      recommendations.push(
        'Более 20% работ имеют низкую оценку. Необходимо проанализировать причины.',
      );
    }

    // Workload recommendations
    const { weekdaysVsWeekends } = statistics.workloadAnalysis;
    if (weekdaysVsWeekends.weekends.count > weekdaysVsWeekends.weekdays.count) {
      recommendations.push(
        'Больше работы выполняется в выходные. Рассмотрите перераспределение нагрузки.',
      );
    }

    if (statistics.totalHaircuts === 0) {
      recommendations.push('Не найдено выполненных работ за указанный период.');
    } else if (statistics.totalHaircuts < 5) {
      recommendations.push(
        'Малое количество выполненных работ. Рассмотрите увеличение объема.',
      );
    }

    // Gender balance recommendations
    const { genderAnalysis } = statistics;
    const totalGenderCount =
      genderAnalysis.male.count + genderAnalysis.female.count;
    if (totalGenderCount > 0) {
      const malePercentage =
        (genderAnalysis.male.count / totalGenderCount) * 100;
      if (malePercentage > 80) {
        recommendations.push(
          'Преобладают мужские стрижки. Рассмотрите расширение услуг для женщин.',
        );
      } else if (malePercentage < 20) {
        recommendations.push(
          'Преобладают женские стрижки. Рассмотрите расширение услуг для мужчин.',
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Все показатели в пределах нормы. Продолжайте поддерживать высокое качество работы.',
      );
    }

    return recommendations;
  }
}
