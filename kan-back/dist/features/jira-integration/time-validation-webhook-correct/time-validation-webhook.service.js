"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeValidationWebhookService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const time_validation_webhook_response_dto_1 = require("./time-validation-webhook.response.dto");
let TimeValidationWebhookService = class TimeValidationWebhookService extends jira_base_service_1.JiraBaseService {
    async execute(requestDto) {
        try {
            const issueKey = requestDto.issue?.key || 'unknown';
            this.logger.log(`Validating time for issue: ${issueKey}`);
            const validationResult = await this.validateTimeSpent(requestDto.issue);
            return new time_validation_webhook_response_dto_1.TimeValidationWebhookResponseDto('validated', issueKey, validationResult.isValid, validationResult.details);
        }
        catch (error) {
            this.logger.error(`Failed to validate time for issue: ${requestDto.issue?.key}`, error.stack);
            return new time_validation_webhook_response_dto_1.TimeValidationWebhookResponseDto('error', requestDto.issue?.key || 'unknown', false, { error: error.message });
        }
    }
    async validateTimeSpent(issue) {
        const timeSpent = issue?.fields?.timespent || 0;
        const timeEstimate = issue?.fields?.timeoriginalestimate || 0;
        const status = issue?.fields?.status?.name || 'Unknown';
        let isValid = true;
        const warnings = [];
        if (status === 'Done' && timeSpent === 0) {
            isValid = false;
            warnings.push('Задача закрыта, но не указано время работы');
        }
        if (timeEstimate > 0 && timeSpent > timeEstimate * 1.5) {
            warnings.push('Превышение оценки более чем на 50%');
        }
        if (status === 'In Progress' && timeSpent > 0 && timeSpent < 900) {
            warnings.push('Очень мало времени для задачи в работе');
        }
        const efficiency = timeEstimate > 0 ? Math.round((timeSpent / timeEstimate) * 100) : 0;
        return {
            isValid,
            details: {
                timeSpent: timeSpent,
                timeSpentHours: Math.round((timeSpent / 3600) * 100) / 100,
                timeEstimate: timeEstimate,
                timeEstimateHours: Math.round((timeEstimate / 3600) * 100) / 100,
                efficiency: efficiency,
                status: status,
                warnings: warnings,
            },
        };
    }
};
exports.TimeValidationWebhookService = TimeValidationWebhookService;
exports.TimeValidationWebhookService = TimeValidationWebhookService = __decorate([
    (0, common_1.Injectable)()
], TimeValidationWebhookService);
//# sourceMappingURL=time-validation-webhook.service.js.map