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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AgentLearningController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentLearningController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_learning_service_1 = require("./agent-learning.service");
class GetAgentMetricsResponseDto {
    agentId;
    totalDecisions;
    successRate;
    averageConfidence;
    improvementTrend;
    strongestAreas;
    weakestAreas;
    suggestedImprovements;
}
class RecordFeedbackRequestDto {
    dataPointId;
    userFeedback;
    additionalNotes;
}
class GetPatternsResponseDto {
    pattern;
    frequency;
    successRate;
    averageConfidence;
    commonFailures;
    recommendations;
}
let AgentLearningController = AgentLearningController_1 = class AgentLearningController {
    learningService;
    logger = new common_1.Logger(AgentLearningController_1.name);
    constructor(learningService) {
        this.learningService = learningService;
    }
    async getAgentMetrics(agentId) {
        this.logger.log(`📊 Getting performance metrics for agent: ${agentId}`);
        const metrics = await this.learningService.getAgentPerformanceMetrics(agentId);
        return {
            agentId: metrics.agentId,
            totalDecisions: metrics.totalDecisions,
            successRate: metrics.successRate,
            averageConfidence: metrics.averageConfidence,
            improvementTrend: metrics.improvementTrend,
            strongestAreas: metrics.strongestAreas,
            weakestAreas: metrics.weakestAreas,
            suggestedImprovements: metrics.suggestedImprovements,
        };
    }
    async getPatterns() {
        this.logger.log('🔍 Analyzing learning patterns...');
        const patterns = await this.learningService.analyzePatterns();
        return patterns.map((pattern) => ({
            pattern: pattern.pattern,
            frequency: pattern.frequency,
            successRate: pattern.successRate,
            averageConfidence: pattern.averageConfidence,
            commonFailures: pattern.commonFailures,
            recommendations: pattern.recommendations,
        }));
    }
    async recordFeedback(request) {
        this.logger.log(`🔄 Recording user feedback: ${request.userFeedback} for ${request.dataPointId}`);
        await this.learningService.updateLearningFromFeedback(request.dataPointId, request.userFeedback, request.additionalNotes);
        return {
            success: true,
            message: 'Обратная связь записана и будет учтена при обучении агента',
        };
    }
    async getImprovementRecommendations(agentId) {
        this.logger.log(`💡 Getting improvement recommendations for agent: ${agentId}`);
        const recommendations = await this.learningService.getImprovementRecommendations(agentId);
        return { recommendations };
    }
    async getBestPractices() {
        this.logger.log('🏆 Getting best practices from learning data...');
        const bestPractices = await this.learningService.getBestPractices();
        return bestPractices;
    }
    async predictActionSuccess(agentId, instructionType, context) {
        this.logger.log(`🎯 Predicting success for agent ${agentId}, instruction: ${instructionType}`);
        const prediction = await this.learningService.predictActionSuccess(agentId, instructionType, context);
        return prediction;
    }
};
exports.AgentLearningController = AgentLearningController;
__decorate([
    (0, common_1.Get)(':agentId/metrics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить метрики производительности агента',
        description: 'Возвращает детальные метрики обучения и производительности агента',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Метрики агента получены успешно',
        type: GetAgentMetricsResponseDto,
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "getAgentMetrics", null);
__decorate([
    (0, common_1.Get)('patterns'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить анализ паттернов обучения',
        description: 'Возвращает анализ паттернов успеха и неудач всех агентов',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Паттерны получены успешно',
        type: [GetPatternsResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "getPatterns", null);
__decorate([
    (0, common_1.Post)('feedback'),
    (0, swagger_1.ApiOperation)({
        summary: 'Записать обратную связь пользователя',
        description: 'Позволяет пользователю оценить качество работы агента для улучшения обучения',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Обратная связь записана успешно',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecordFeedbackRequestDto]),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "recordFeedback", null);
__decorate([
    (0, common_1.Get)(':agentId/recommendations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить рекомендации по улучшению агента',
        description: 'Возвращает персонализированные рекомендации по улучшению работы агента',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Рекомендации получены успешно',
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "getImprovementRecommendations", null);
__decorate([
    (0, common_1.Get)('best-practices'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить лучшие практики на основе обучения',
        description: 'Возвращает выявленные лучшие практики работы агентов',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Лучшие практики получены успешно',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "getBestPractices", null);
__decorate([
    (0, common_1.Get)(':agentId/predict/:instructionType'),
    (0, swagger_1.ApiOperation)({
        summary: 'Предсказать успешность действия агента',
        description: 'Предсказывает вероятность успешного выполнения действия на основе истории',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiParam)({ name: 'instructionType', description: 'Тип инструкции' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Предсказание выполнено успешно',
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Param)('instructionType')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentLearningController.prototype, "predictActionSuccess", null);
exports.AgentLearningController = AgentLearningController = AgentLearningController_1 = __decorate([
    (0, swagger_1.ApiTags)('AI Agent Learning'),
    (0, common_1.Controller)('ai-agent/learning'),
    __metadata("design:paramtypes", [agent_learning_service_1.AgentLearningService])
], AgentLearningController);
//# sourceMappingURL=agent-learning.controller.js.map