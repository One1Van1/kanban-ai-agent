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
var AgentLearningService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentLearningService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../entities/task-history.entity");
let AgentLearningService = AgentLearningService_1 = class AgentLearningService {
    taskHistoryRepository;
    logger = new common_1.Logger(AgentLearningService_1.name);
    learningData = [];
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async recordLearningData(data) {
        const learningPoint = {
            id: this.generateId(),
            timestamp: new Date(),
            ...data,
        };
        this.learningData.push(learningPoint);
        this.logger.log(`📚 Recorded learning data: Agent ${data.agentId}, Success: ${data.outcome.successful}, Confidence: ${data.decision.confidence}%`);
        await this.saveToDatabase(learningPoint);
        if (this.learningData.length % 10 === 0) {
            await this.analyzePatterns();
        }
    }
    async analyzePatterns() {
        this.logger.log('🔍 Analyzing patterns from learning data...');
        const insights = [];
        const groupedData = this.groupByInstructionType();
        for (const [instructionType, dataPoints] of Object.entries(groupedData)) {
            const successfulActions = dataPoints.filter((d) => d.outcome.successful);
            const successRate = successfulActions.length / dataPoints.length;
            const avgConfidence = dataPoints.reduce((sum, d) => sum + d.decision.confidence, 0) /
                dataPoints.length;
            const commonFailures = this.extractCommonFailures(dataPoints.filter((d) => !d.outcome.successful));
            const insight = {
                pattern: instructionType,
                frequency: dataPoints.length,
                successRate,
                averageConfidence: avgConfidence,
                commonFailures,
                recommendations: this.generateRecommendations(instructionType, successRate, avgConfidence),
            };
            insights.push(insight);
        }
        this.logger.log(`🔍 Analyzed ${insights.length} patterns`);
        return insights;
    }
    async getAgentPerformanceMetrics(agentId) {
        const agentData = this.learningData.filter((d) => d.agentId === agentId);
        if (agentData.length === 0) {
            return {
                agentId,
                totalDecisions: 0,
                successRate: 0,
                averageConfidence: 0,
                improvementTrend: 'stable',
                strongestAreas: [],
                weakestAreas: [],
                suggestedImprovements: ['Недостаточно данных для анализа'],
            };
        }
        const successfulDecisions = agentData.filter((d) => d.outcome.successful);
        const successRate = successfulDecisions.length / agentData.length;
        const avgConfidence = agentData.reduce((sum, d) => sum + d.decision.confidence, 0) /
            agentData.length;
        const improvementTrend = this.calculateImprovementTrend(agentData);
        const strongestAreas = this.identifyStrongestAreas(agentData);
        const weakestAreas = this.identifyWeakestAreas(agentData);
        const suggestedImprovements = this.generateImprovementSuggestions(agentData);
        return {
            agentId,
            totalDecisions: agentData.length,
            successRate,
            averageConfidence: avgConfidence,
            improvementTrend,
            strongestAreas,
            weakestAreas,
            suggestedImprovements,
        };
    }
    async predictActionSuccess(agentId, instructionType, context) {
        const similarCases = this.learningData.filter((d) => d.agentId === agentId && this.isSimilarContext(d.context, context));
        if (similarCases.length === 0) {
            return {
                predictedSuccessRate: 0.5,
                confidence: 0.1,
                recommendations: [
                    'Недостаточно исторических данных для точного предсказания',
                ],
            };
        }
        const successfulCases = similarCases.filter((c) => c.outcome.successful);
        const predictedSuccessRate = successfulCases.length / similarCases.length;
        const confidence = Math.min(similarCases.length / 10, 1);
        const recommendations = this.generatePredictionRecommendations(similarCases, predictedSuccessRate);
        this.logger.log(`🎯 Prediction for ${agentId}: ${(predictedSuccessRate * 100).toFixed(1)}% success rate (confidence: ${(confidence * 100).toFixed(1)}%)`);
        return {
            predictedSuccessRate,
            confidence,
            recommendations,
        };
    }
    async updateLearningFromFeedback(dataPointId, userFeedback, additionalNotes) {
        const dataPoint = this.learningData.find((d) => d.id === dataPointId);
        if (dataPoint) {
            dataPoint.outcome.userFeedback = userFeedback;
            if (additionalNotes) {
                dataPoint.outcome.learningPoints.push(additionalNotes);
            }
            if (userFeedback === 'positive') {
                dataPoint.outcome.impactScore = Math.min(dataPoint.outcome.impactScore + 2, 10);
            }
            else if (userFeedback === 'negative') {
                dataPoint.outcome.impactScore = Math.max(dataPoint.outcome.impactScore - 2, 1);
            }
            this.logger.log(`🔄 Updated learning data ${dataPointId} with ${userFeedback} feedback`);
        }
    }
    async getImprovementRecommendations(agentId) {
        const metrics = await this.getAgentPerformanceMetrics(agentId);
        const patterns = await this.analyzePatterns();
        const recommendations = [];
        if (metrics.successRate < 0.7) {
            recommendations.push('Низкий уровень успешности - рекомендуется пересмотреть инструкции');
        }
        if (metrics.averageConfidence < 50) {
            recommendations.push('Низкая уверенность в решениях - добавить больше контекста');
        }
        const lowPerformancePatterns = patterns.filter((p) => p.successRate < 0.6);
        for (const pattern of lowPerformancePatterns) {
            recommendations.push(`Проблемы с паттерном "${pattern.pattern}" - ${pattern.recommendations.join(', ')}`);
        }
        for (const weakArea of metrics.weakestAreas) {
            recommendations.push(`Улучшить работу с: ${weakArea}`);
        }
        return recommendations;
    }
    async getBestPractices() {
        const successfulData = this.learningData.filter((d) => d.outcome.successful);
        const instructionSuccess = this.groupByInstructionType(successfulData);
        const mostSuccessfulInstructions = Object.keys(instructionSuccess)
            .sort((a, b) => instructionSuccess[b].length - instructionSuccess[a].length)
            .slice(0, 5);
        const confidenceLevels = successfulData.map((d) => d.decision.confidence);
        const optimalConfidenceLevels = {
            min: Math.min(...confidenceLevels),
            max: Math.max(...confidenceLevels),
        };
        const contextTypes = successfulData.map((d) => `${d.context.taskType}-${d.context.urgency}`);
        const contextFrequency = this.calculateFrequency(contextTypes);
        const bestContextTypes = Object.keys(contextFrequency)
            .sort((a, b) => contextFrequency[b] - contextFrequency[a])
            .slice(0, 5);
        return {
            mostSuccessfulInstructions,
            optimalConfidenceLevels,
            bestContextTypes,
        };
    }
    generateId() {
        return `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async saveToDatabase(data) {
        try {
            const taskHistory = this.taskHistoryRepository.create({
                taskKey: `learning_${data.id}`,
                taskId: data.id,
                taskTitle: `Learning Data for Agent ${data.agentId}`,
                agentId: data.agentId,
                action: 'learning_data',
                status: data.outcome.successful ? 'completed' : 'failed',
                context: {
                    learningContext: data.context,
                    decision: data.decision,
                },
                agentResponse: {
                    execution: data.execution,
                    outcome: data.outcome,
                },
                executedInstruction: data.instruction,
                processingTimeMs: data.execution.executionTime,
            });
            await this.taskHistoryRepository.save(taskHistory);
        }
        catch (error) {
            this.logger.error('Failed to save learning data to database:', error);
        }
    }
    groupByInstructionType(data = this.learningData) {
        return data.reduce((groups, item) => {
            const type = this.extractInstructionType(item.instruction);
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(item);
            return groups;
        }, {});
    }
    extractInstructionType(instruction) {
        const lowerInstruction = instruction.toLowerCase();
        if (lowerInstruction.includes('уведом') ||
            lowerInstruction.includes('notif')) {
            return 'notification';
        }
        if (lowerInstruction.includes('коммент') ||
            lowerInstruction.includes('comment')) {
            return 'comment';
        }
        if (lowerInstruction.includes('перенес') ||
            lowerInstruction.includes('move')) {
            return 'move_task';
        }
        if (lowerInstruction.includes('анализ') ||
            lowerInstruction.includes('analyz')) {
            return 'analysis';
        }
        if (lowerInstruction.includes('назнач') ||
            lowerInstruction.includes('assign')) {
            return 'assignment';
        }
        return 'general';
    }
    extractCommonFailures(failedData) {
        const failures = [];
        for (const data of failedData) {
            failures.push(...data.outcome.learningPoints);
        }
        return Array.from(new Set(failures)).slice(0, 5);
    }
    generateRecommendations(instructionType, successRate, avgConfidence) {
        const recommendations = [];
        if (successRate < 0.5) {
            recommendations.push('Пересмотреть логику выполнения для данного типа инструкций');
        }
        if (avgConfidence < 50) {
            recommendations.push('Добавить больше контекстной информации');
        }
        if (instructionType === 'notification' && successRate < 0.8) {
            recommendations.push('Проверить настройки уведомлений и доступность сервисов');
        }
        return recommendations;
    }
    calculateImprovementTrend(data) {
        if (data.length < 5)
            return 'stable';
        const recent = data.slice(-5);
        const older = data.slice(-10, -5);
        const recentSuccess = recent.filter((d) => d.outcome.successful).length / recent.length;
        const olderSuccess = older.length > 0
            ? older.filter((d) => d.outcome.successful).length / older.length
            : recentSuccess;
        if (recentSuccess > olderSuccess + 0.1)
            return 'increasing';
        if (recentSuccess < olderSuccess - 0.1)
            return 'decreasing';
        return 'stable';
    }
    identifyStrongestAreas(data) {
        const areaSuccess = {};
        for (const item of data) {
            const area = item.context.taskType;
            if (!areaSuccess[area]) {
                areaSuccess[area] = { total: 0, successful: 0 };
            }
            areaSuccess[area].total++;
            if (item.outcome.successful) {
                areaSuccess[area].successful++;
            }
        }
        return Object.keys(areaSuccess)
            .filter((area) => areaSuccess[area].total >= 3)
            .sort((a, b) => areaSuccess[b].successful / areaSuccess[b].total -
            areaSuccess[a].successful / areaSuccess[a].total)
            .slice(0, 3);
    }
    identifyWeakestAreas(data) {
        const areaSuccess = {};
        for (const item of data) {
            const area = item.context.taskType;
            if (!areaSuccess[area]) {
                areaSuccess[area] = { total: 0, successful: 0 };
            }
            areaSuccess[area].total++;
            if (item.outcome.successful) {
                areaSuccess[area].successful++;
            }
        }
        return Object.keys(areaSuccess)
            .filter((area) => areaSuccess[area].total >= 3)
            .sort((a, b) => areaSuccess[a].successful / areaSuccess[a].total -
            areaSuccess[b].successful / areaSuccess[b].total)
            .slice(0, 3);
    }
    generateImprovementSuggestions(data) {
        const suggestions = [];
        const failedActions = data.filter((d) => !d.outcome.successful);
        const avgConfidence = data.reduce((sum, d) => sum + d.decision.confidence, 0) / data.length;
        if (failedActions.length > data.length * 0.3) {
            suggestions.push('Высокий процент неудачных действий - пересмотреть инструкции');
        }
        if (avgConfidence < 60) {
            suggestions.push('Низкая уверенность в решениях - добавить больше обучающих данных');
        }
        const lowImpactActions = data.filter((d) => d.outcome.impactScore < 5);
        if (lowImpactActions.length > data.length * 0.5) {
            suggestions.push('Много действий с низким влиянием - фокус на более значимых задачах');
        }
        return suggestions;
    }
    isSimilarContext(context1, context2) {
        return (context1.taskType === context2.taskType &&
            context1.urgency === context2.urgency &&
            context1.columnName === context2.columnName);
    }
    generatePredictionRecommendations(similarCases, successRate) {
        const recommendations = [];
        if (successRate < 0.5) {
            recommendations.push('Низкая вероятность успеха - рассмотреть альтернативные подходы');
        }
        if (successRate > 0.8) {
            recommendations.push('Высокая вероятность успеха - можно выполнять с уверенностью');
        }
        const avgConfidence = similarCases.reduce((sum, c) => sum + c.decision.confidence, 0) /
            similarCases.length;
        if (avgConfidence < 60) {
            recommendations.push('Исторически низкая уверенность - добавить дополнительные проверки');
        }
        return recommendations;
    }
    calculateFrequency(items) {
        return items.reduce((freq, item) => {
            freq[item] = (freq[item] || 0) + 1;
            return freq;
        }, {});
    }
};
exports.AgentLearningService = AgentLearningService;
exports.AgentLearningService = AgentLearningService = AgentLearningService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AgentLearningService);
//# sourceMappingURL=agent-learning.service.js.map