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
var ProcessReportTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessReportTaskService = void 0;
const common_1 = require("@nestjs/common");
const process_report_task_response_dto_1 = require("./process-report-task.response.dto");
const search_tasks_service_1 = require("../../jira-integration/search-tasks-correct/search-tasks.service");
const add_task_comment_service_1 = require("../../jira-integration/add-task-comment/add-task-comment.service");
const move_task_service_1 = require("../../jira-integration/move-task-correct/move-task.service");
const generate_report_service_1 = require("../generate-report/generate-report.service");
let ProcessReportTaskService = ProcessReportTaskService_1 = class ProcessReportTaskService {
    searchTasksService;
    addTaskCommentService;
    moveTaskService;
    generateReportService;
    logger = new common_1.Logger(ProcessReportTaskService_1.name);
    constructor(searchTasksService, addTaskCommentService, moveTaskService, generateReportService) {
        this.searchTasksService = searchTasksService;
        this.addTaskCommentService = addTaskCommentService;
        this.moveTaskService = moveTaskService;
        this.generateReportService = generateReportService;
    }
    async execute(dto) {
        this.logger.log(`🎯 Processing report task: ${dto.taskKey}`);
        try {
            const taskDetails = await this.searchTasksService.execute({
                jql: `key = "${dto.taskKey}"`,
                startAt: 0,
                maxResults: 1
            });
            if (!taskDetails.issues || taskDetails.issues.length === 0) {
                throw new Error(`Task ${dto.taskKey} not found`);
            }
            const task = taskDetails.issues[0];
            const description = this.extractDescriptionText(task.fields.description) || '';
            const assigneeDisplayName = task.fields.assignee?.displayName;
            if (assigneeDisplayName !== 'AI-Report-maker') {
                this.logger.log(`⏩ Task ${dto.taskKey} not assigned to AI-Report-maker, skipping`);
                return new process_report_task_response_dto_1.ProcessReportTaskResponseDto(false, `Task ${dto.taskKey} not assigned to AI-Report-maker`);
            }
            try {
                const taskWithComments = await this.searchTasksService.execute({
                    jql: `key = "${dto.taskKey}"`,
                    startAt: 0,
                    maxResults: 1
                });
                const existingComments = taskWithComments.issues[0].fields.comment?.comments || [];
                const hasReportComment = existingComments.some((comment) => {
                    const commentText = this.extractDescriptionText(comment.body) || '';
                    return commentText.includes('Отчет готов. Всего стрижек:');
                });
                if (hasReportComment) {
                    this.logger.log(`⏩ Task ${dto.taskKey} already has a report comment, skipping`);
                    return new process_report_task_response_dto_1.ProcessReportTaskResponseDto(true, `Task ${dto.taskKey} already has a report comment`);
                }
            }
            catch (error) {
                this.logger.warn(`Could not check existing comments for ${dto.taskKey}, proceeding anyway`);
            }
            const report = await this.generateReportService.execute({
                taskKey: dto.taskKey,
                dateRange: description,
                assigneeEmail: assigneeDisplayName,
            });
            const formattedReport = this.formatReportComment(report);
            this.logger.log(`📋 Report ready: ${formattedReport.substring(0, 100)}...`);
            try {
                await this.addTaskCommentService.addCommentToTask(dto.taskKey, formattedReport);
                this.logger.log(`✅ Comment added to task ${dto.taskKey}`);
            }
            catch (error) {
                this.logger.error(`❌ Failed to add comment to ${dto.taskKey}:`, error.response?.data || error.message);
            }
            await this.moveTaskService.execute(dto.taskKey, {
                targetColumn: 'Done',
                comment: 'Отчет обработан автоматически'
            });
            const message = `Report task ${dto.taskKey} processed successfully`;
            this.logger.log(`✅ ${message}`);
            return new process_report_task_response_dto_1.ProcessReportTaskResponseDto(true, message);
        }
        catch (error) {
            this.logger.error(`❌ Error processing report task ${dto.taskKey}:`, error);
            throw error;
        }
    }
    extractDescriptionText(description) {
        if (typeof description === 'string') {
            return description;
        }
        if (description?.content) {
            return this.extractTextFromContent(description.content);
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
    formatReportComment(report) {
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
        if (stats.genderAnalysis.male.count > 0 ||
            stats.genderAnalysis.female.count > 0) {
            comment += `**👥 Анализ по полу:**\n`;
            comment += `• Мужчины: ${stats.genderAnalysis.male.count} (средняя оценка: ${stats.genderAnalysis.male.averageScore.toFixed(1)})\n`;
            comment += `• Женщины: ${stats.genderAnalysis.female.count} (средняя оценка: ${stats.genderAnalysis.female.averageScore.toFixed(1)})\n\n`;
        }
        if (Object.keys(stats.dayOfWeekAnalysis).length > 0) {
            comment += `**📅 Нагрузка по дням недели:**\n`;
            Object.entries(stats.dayOfWeekAnalysis).forEach(([day, data]) => {
                comment += `• ${day}: ${data.count} стрижек (средняя оценка: ${data.averageScore.toFixed(1)})\n`;
            });
            comment += `\n`;
        }
        if (report.recommendations && report.recommendations.length > 0) {
            comment += `**💡 Рекомендации:**\n`;
            report.recommendations.forEach((rec, index) => {
                comment += `${index + 1}. ${rec}\n`;
            });
        }
        comment += `\n*Отчет сгенерирован автоматически: ${new Date().toLocaleString('ru-RU')}*`;
        return comment;
    }
};
exports.ProcessReportTaskService = ProcessReportTaskService;
exports.ProcessReportTaskService = ProcessReportTaskService = ProcessReportTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [search_tasks_service_1.SearchTasksService,
        add_task_comment_service_1.AddTaskCommentService,
        move_task_service_1.MoveTaskService,
        generate_report_service_1.GenerateReportService])
], ProcessReportTaskService);
//# sourceMappingURL=process-report-task.service.js.map