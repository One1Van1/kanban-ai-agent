"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GenerateReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const chrono = require("chrono-node");
const generate_report_response_dto_1 = require("./generate-report.response.dto");
const search_tasks_service_1 = require("../../jira-integration/search-tasks-correct/search-tasks.service");
let GenerateReportService = GenerateReportService_1 = class GenerateReportService {
    configService;
    searchTasksService;
    logger = new common_1.Logger(GenerateReportService_1.name);
    constructor(configService, searchTasksService) {
        this.configService = configService;
        this.searchTasksService = searchTasksService;
    }
    async execute(dto) {
        this.logger.log(`🎯 Starting report generation for task: ${dto.taskKey}`);
        try {
            const dateRange = this.parseDateRange(dto.dateRange);
            this.logger.log(`📅 Parsed date range: ${dateRange.startDate} to ${dateRange.endDate}`);
            const haircutTasks = await this.findHaircutTasks(dateRange);
            this.logger.log(`🔍 Found ${haircutTasks.length} haircut tasks in date range`);
            const analyses = await this.extractClaudeAnalyses(haircutTasks);
            this.logger.log(`🧠 Extracted ${analyses.length} Claude analyses`);
            const statistics = this.calculateStatistics(analyses, dateRange);
            const recommendations = this.generateRecommendations(analyses, statistics);
            const report = new generate_report_response_dto_1.GenerateReportResponseDto(statistics, analyses, recommendations, new Date().toISOString());
            this.logger.log(`✅ Report generated successfully for ${dto.taskKey}`);
            return report;
        }
        catch (error) {
            this.logger.error(`❌ Error generating report for ${dto.taskKey}:`, error);
            throw error;
        }
    }
    parseDateRange(dateRangeText) {
        const now = new Date();
        const moscowOffset = 3 * 60;
        const localTime = new Date(now.getTime() + moscowOffset * 60 * 1000);
        if (dateRangeText.includes('сегодня') || dateRangeText.includes('today')) {
            const today = localTime.toISOString().split('T')[0];
            return { startDate: today, endDate: today };
        }
        if (dateRangeText.includes('вчера') ||
            dateRangeText.includes('yesterday')) {
            const yesterday = new Date(localTime);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            return { startDate: yesterdayStr, endDate: yesterdayStr };
        }
        const parsedDates = chrono.parse(dateRangeText);
        if (parsedDates.length >= 2) {
            const startDate = parsedDates[0].start.date().toISOString().split('T')[0];
            const endDate = parsedDates[1].start.date().toISOString().split('T')[0];
            return { startDate, endDate };
        }
        else if (parsedDates.length === 1) {
            const date = parsedDates[0].start.date().toISOString().split('T')[0];
            return { startDate: date, endDate: date };
        }
        const endDate = localTime.toISOString().split('T')[0];
        const startDate = new Date(localTime);
        startDate.setDate(startDate.getDate() - 7);
        const startDateStr = startDate.toISOString().split('T')[0];
        return { startDate: startDateStr, endDate };
    }
    async findHaircutTasks(dateRange) {
        const jql = `created >= "${dateRange.startDate}" AND created <= "${dateRange.endDate}" AND summary ~ "стрижк*" OR summary ~ "haircut*" OR summary ~ "причёск*" OR summary ~ "hair*" OR summary ~ "волос*" OR summary ~ "маникюр*"`;
        const searchResult = await this.searchTasksService.execute({
            jql,
            startAt: 0,
            maxResults: 100
        });
        return searchResult.issues || [];
    }
    async extractClaudeAnalyses(tasks) {
        const analyses = [];
        for (const task of tasks) {
            try {
                const comments = task.fields?.comment?.comments || [];
                const claudeComment = comments.find((comment) => {
                    const bodyText = this.extractCommentText(comment.body);
                    return (bodyText.includes('🤖 **AI АНАЛИЗ СТРИЖКИ**') ||
                        bodyText.includes('AI ANALYSIS OF HAIRCUT'));
                });
                if (claudeComment) {
                    const analysis = this.parseClaudeAnalysis(claudeComment, task);
                    if (analysis) {
                        analyses.push(analysis);
                    }
                }
            }
            catch (error) {
                this.logger.warn(`Failed to extract analysis from task ${task.key}:`, error);
            }
        }
        return analyses;
    }
    extractCommentText(body) {
        if (typeof body === 'string') {
            return body;
        }
        if (body?.content) {
            return this.extractTextFromContent(body.content);
        }
        return '';
    }
    extractTextFromContent(content) {
        return content
            .map((item) => {
            if (item.type === 'paragraph' && item.content) {
                return item.content
                    .map((textItem) => textItem.text || '')
                    .join('');
            }
            return '';
        })
            .join('\n');
    }
    parseClaudeAnalysis(comment, task) {
        try {
            const bodyText = this.extractCommentText(comment.body);
            const scoreMatch = bodyText.match(/(\d+)\/10/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
            let gender = 'unknown';
            if (bodyText.includes('Пол: Мужской') ||
                bodyText.includes('Gender: Male')) {
                gender = 'male';
            }
            else if (bodyText.includes('Пол: Женский') ||
                bodyText.includes('Gender: Female')) {
                gender = 'female';
            }
            const styleMatch = bodyText.match(/Стиль: (.+)/i) || bodyText.match(/Style: (.+)/i);
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
        }
        catch (error) {
            this.logger.warn(`Failed to parse Claude analysis:`, error);
            return null;
        }
    }
    calculateStatistics(analyses, dateRange) {
        const totalHaircuts = analyses.length;
        const averageScore = totalHaircuts > 0
            ? analyses.reduce((sum, a) => sum + a.score, 0) / totalHaircuts
            : 0;
        const excellentCount = analyses.filter((a) => a.score >= 9).length;
        const goodCount = analyses.filter((a) => a.score >= 7 && a.score < 9).length;
        const satisfactoryCount = analyses.filter((a) => a.score >= 5 && a.score < 7).length;
        const poorCount = analyses.filter((a) => a.score < 5).length;
        const maleAnalyses = analyses.filter((a) => a.gender === 'male');
        const femaleAnalyses = analyses.filter((a) => a.gender === 'female');
        const genderAnalysis = {
            male: {
                count: maleAnalyses.length,
                averageScore: maleAnalyses.length > 0
                    ? maleAnalyses.reduce((sum, a) => sum + a.score, 0) /
                        maleAnalyses.length
                    : 0,
                popularStyles: this.getPopularStyles(maleAnalyses),
            },
            female: {
                count: femaleAnalyses.length,
                averageScore: femaleAnalyses.length > 0
                    ? femaleAnalyses.reduce((sum, a) => sum + a.score, 0) /
                        femaleAnalyses.length
                    : 0,
                popularStyles: this.getPopularStyles(femaleAnalyses),
            },
        };
        const dayOfWeekAnalysis = {};
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
        Object.keys(dayOfWeekAnalysis).forEach((day) => {
            const dayAnalyses = analyses.filter((a) => a.dayOfWeek === day);
            dayOfWeekAnalysis[day].averageScore =
                dayAnalyses.length > 0
                    ? dayAnalyses.reduce((sum, a) => sum + a.score, 0) /
                        dayAnalyses.length
                    : 0;
        });
        const dayCounts = Object.entries(dayOfWeekAnalysis).map(([day, data]) => ({
            day,
            count: data.count,
        }));
        const busiestDay = dayCounts.reduce((max, current) => (current.count > max.count ? current : max), { day: '', count: 0 });
        const quietestDay = dayCounts.reduce((min, current) => (current.count < min.count ? current : min), { day: '', count: Infinity });
        const weekdaysCount = analyses.filter((a) => !weekends.includes(a.dayOfWeek.toLowerCase())).length;
        const weekendsCount = analyses.filter((a) => weekends.includes(a.dayOfWeek.toLowerCase())).length;
        const workloadAnalysis = {
            busiestDay: busiestDay.day,
            quietestDay: quietestDay.day,
            weekdaysVsWeekends: {
                weekdays: {
                    count: weekdaysCount,
                    percentage: totalHaircuts > 0
                        ? Math.round((weekdaysCount / totalHaircuts) * 100)
                        : 0,
                },
                weekends: {
                    count: weekendsCount,
                    percentage: totalHaircuts > 0
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
    getPopularStyles(analyses) {
        const styles = analyses
            .map((a) => a.haircutStyle)
            .filter((style) => Boolean(style));
        const styleCounts = styles.reduce((acc, style) => {
            acc[style] = (acc[style] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(styleCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([style]) => style);
    }
    generateRecommendations(analyses, statistics) {
        const recommendations = [];
        if (statistics.averageScore < 7) {
            recommendations.push('Средняя оценка ниже 7. Рекомендуется усилить контроль качества работы.');
        }
        if (statistics.poorCount > statistics.totalHaircuts * 0.2) {
            recommendations.push('Более 20% работ имеют низкую оценку. Необходимо проанализировать причины.');
        }
        const { weekdaysVsWeekends } = statistics.workloadAnalysis;
        if (weekdaysVsWeekends.weekends.count > weekdaysVsWeekends.weekdays.count) {
            recommendations.push('Больше работы выполняется в выходные. Рассмотрите перераспределение нагрузки.');
        }
        if (statistics.totalHaircuts === 0) {
            recommendations.push('Не найдено выполненных работ за указанный период.');
        }
        else if (statistics.totalHaircuts < 5) {
            recommendations.push('Малое количество выполненных работ. Рассмотрите увеличение объема.');
        }
        const { genderAnalysis } = statistics;
        const totalGenderCount = genderAnalysis.male.count + genderAnalysis.female.count;
        if (totalGenderCount > 0) {
            const malePercentage = (genderAnalysis.male.count / totalGenderCount) * 100;
            if (malePercentage > 80) {
                recommendations.push('Преобладают мужские стрижки. Рассмотрите расширение услуг для женщин.');
            }
            else if (malePercentage < 20) {
                recommendations.push('Преобладают женские стрижки. Рассмотрите расширение услуг для мужчин.');
            }
        }
        if (recommendations.length === 0) {
            recommendations.push('Все показатели в пределах нормы. Продолжайте поддерживать высокое качество работы.');
        }
        return recommendations;
    }
};
exports.GenerateReportService = GenerateReportService;
exports.GenerateReportService = GenerateReportService = GenerateReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        search_tasks_service_1.SearchTasksService])
], GenerateReportService);
//# sourceMappingURL=generate-report.service.js.map