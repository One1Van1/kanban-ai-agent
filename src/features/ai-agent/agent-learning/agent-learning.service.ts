import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../entities/task-history.entity';

export interface LearningDataPoint {
  id: string;
  timestamp: Date;
  agentId: string;
  instruction: string;
  context: {
    taskType: string;
    urgency: string;
    complexity: string;
    columnName: string;
    triggerType: string;
  };
  decision: {
    shouldExecute: boolean;
    confidence: number;
    reasoning: string;
    actionsCount: number;
  };
  execution: {
    wasExecuted: boolean;
    successRate: number;
    resultsCount: number;
    executionTime: number;
  };
  outcome: {
    successful: boolean;
    userFeedback?: 'positive' | 'negative' | 'neutral';
    impactScore: number; // 1-10
    learningPoints: string[];
  };
}

export interface PatternInsight {
  pattern: string;
  frequency: number;
  successRate: number;
  averageConfidence: number;
  commonFailures: string[];
  recommendations: string[];
}

export interface AgentPerformanceMetrics {
  agentId: string;
  totalDecisions: number;
  successRate: number;
  averageConfidence: number;
  improvementTrend: 'increasing' | 'decreasing' | 'stable';
  strongestAreas: string[];
  weakestAreas: string[];
  suggestedImprovements: string[];
}

@Injectable()
export class AgentLearningService {
  private readonly logger = new Logger(AgentLearningService.name);
  private readonly learningData: LearningDataPoint[] = [];

  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  /**
   * 📚 Записать данные для обучения
   */
  async recordLearningData(
    data: Omit<LearningDataPoint, 'id' | 'timestamp'>,
  ): Promise<void> {
    const learningPoint: LearningDataPoint = {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
    };

    this.learningData.push(learningPoint);

    this.logger.log(
      `📚 Recorded learning data: Agent ${data.agentId}, Success: ${data.outcome.successful}, Confidence: ${data.decision.confidence}%`,
    );

    // Сохраняем в базу данных для долгосрочного хранения
    await this.saveToDatabase(learningPoint);

    // Если накопилось достаточно данных, запускаем анализ
    if (this.learningData.length % 10 === 0) {
      await this.analyzePatterns();
    }
  }

  /**
   * 🔍 Анализ паттернов успеха и неудач
   */
  async analyzePatterns(): Promise<PatternInsight[]> {
    this.logger.log('🔍 Analyzing patterns from learning data...');

    const insights: PatternInsight[] = [];

    // Группируем данные по типам инструкций
    const groupedData = this.groupByInstructionType();

    for (const [instructionType, dataPoints] of Object.entries(groupedData)) {
      const successfulActions = dataPoints.filter((d) => d.outcome.successful);
      const successRate = successfulActions.length / dataPoints.length;

      const avgConfidence =
        dataPoints.reduce((sum, d) => sum + d.decision.confidence, 0) /
        dataPoints.length;

      const commonFailures = this.extractCommonFailures(
        dataPoints.filter((d) => !d.outcome.successful),
      );

      const insight: PatternInsight = {
        pattern: instructionType,
        frequency: dataPoints.length,
        successRate,
        averageConfidence: avgConfidence,
        commonFailures,
        recommendations: this.generateRecommendations(
          instructionType,
          successRate,
          avgConfidence,
        ),
      };

      insights.push(insight);
    }

    this.logger.log(`🔍 Analyzed ${insights.length} patterns`);
    return insights;
  }

  /**
   * 📊 Получить метрики производительности агента
   */
  async getAgentPerformanceMetrics(
    agentId: string,
  ): Promise<AgentPerformanceMetrics> {
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

    const avgConfidence =
      agentData.reduce((sum, d) => sum + d.decision.confidence, 0) /
      agentData.length;

    const improvementTrend = this.calculateImprovementTrend(agentData);
    const strongestAreas = this.identifyStrongestAreas(agentData);
    const weakestAreas = this.identifyWeakestAreas(agentData);
    const suggestedImprovements =
      this.generateImprovementSuggestions(agentData);

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

  /**
   * 🎯 Предсказать успешность действия на основе обучения
   */
  async predictActionSuccess(
    agentId: string,
    instructionType: string,
    context: LearningDataPoint['context'],
  ): Promise<{
    predictedSuccessRate: number;
    confidence: number;
    recommendations: string[];
  }> {
    // Находим похожие случаи из истории
    const similarCases = this.learningData.filter(
      (d) => d.agentId === agentId && this.isSimilarContext(d.context, context),
    );

    if (similarCases.length === 0) {
      return {
        predictedSuccessRate: 0.5, // Нейтральная оценка при отсутствии данных
        confidence: 0.1,
        recommendations: [
          'Недостаточно исторических данных для точного предсказания',
        ],
      };
    }

    const successfulCases = similarCases.filter((c) => c.outcome.successful);
    const predictedSuccessRate = successfulCases.length / similarCases.length;
    const confidence = Math.min(similarCases.length / 10, 1); // Уверенность растет с количеством данных

    const recommendations = this.generatePredictionRecommendations(
      similarCases,
      predictedSuccessRate,
    );

    this.logger.log(
      `🎯 Prediction for ${agentId}: ${(predictedSuccessRate * 100).toFixed(1)}% success rate (confidence: ${(confidence * 100).toFixed(1)}%)`,
    );

    return {
      predictedSuccessRate,
      confidence,
      recommendations,
    };
  }

  /**
   * 🔄 Обновить данные обучения на основе фидбека
   */
  async updateLearningFromFeedback(
    dataPointId: string,
    userFeedback: 'positive' | 'negative' | 'neutral',
    additionalNotes?: string,
  ): Promise<void> {
    const dataPoint = this.learningData.find((d) => d.id === dataPointId);

    if (dataPoint) {
      dataPoint.outcome.userFeedback = userFeedback;

      if (additionalNotes) {
        dataPoint.outcome.learningPoints.push(additionalNotes);
      }

      // Корректируем impact score на основе фидбека
      if (userFeedback === 'positive') {
        dataPoint.outcome.impactScore = Math.min(
          dataPoint.outcome.impactScore + 2,
          10,
        );
      } else if (userFeedback === 'negative') {
        dataPoint.outcome.impactScore = Math.max(
          dataPoint.outcome.impactScore - 2,
          1,
        );
      }

      this.logger.log(
        `🔄 Updated learning data ${dataPointId} with ${userFeedback} feedback`,
      );
    }
  }

  /**
   * 📈 Получить рекомендации по улучшению агента
   */
  async getImprovementRecommendations(agentId: string): Promise<string[]> {
    const metrics = await this.getAgentPerformanceMetrics(agentId);
    const patterns = await this.analyzePatterns();

    const recommendations: string[] = [];

    // Рекомендации на основе метрик производительности
    if (metrics.successRate < 0.7) {
      recommendations.push(
        'Низкий уровень успешности - рекомендуется пересмотреть инструкции',
      );
    }

    if (metrics.averageConfidence < 50) {
      recommendations.push(
        'Низкая уверенность в решениях - добавить больше контекста',
      );
    }

    // Рекомендации на основе паттернов
    const lowPerformancePatterns = patterns.filter((p) => p.successRate < 0.6);
    for (const pattern of lowPerformancePatterns) {
      recommendations.push(
        `Проблемы с паттерном "${pattern.pattern}" - ${pattern.recommendations.join(', ')}`,
      );
    }

    // Рекомендации по слабым областям
    for (const weakArea of metrics.weakestAreas) {
      recommendations.push(`Улучшить работу с: ${weakArea}`);
    }

    return recommendations;
  }

  /**
   * 🏆 Получить лучшие практики на основе обучения
   */
  async getBestPractices(): Promise<{
    mostSuccessfulInstructions: string[];
    optimalConfidenceLevels: { min: number; max: number };
    bestContextTypes: string[];
  }> {
    const successfulData = this.learningData.filter(
      (d) => d.outcome.successful,
    );

    // Самые успешные типы инструкций
    const instructionSuccess = this.groupByInstructionType(successfulData);
    const mostSuccessfulInstructions = Object.keys(instructionSuccess)
      .sort(
        (a, b) => instructionSuccess[b].length - instructionSuccess[a].length,
      )
      .slice(0, 5);

    // Оптимальные уровни уверенности
    const confidenceLevels = successfulData.map((d) => d.decision.confidence);
    const optimalConfidenceLevels = {
      min: Math.min(...confidenceLevels),
      max: Math.max(...confidenceLevels),
    };

    // Лучшие типы контекста
    const contextTypes = successfulData.map(
      (d) => `${d.context.taskType}-${d.context.urgency}`,
    );
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

  // Приватные методы для внутренней логики

  private generateId(): string {
    return `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveToDatabase(data: LearningDataPoint): Promise<void> {
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
    } catch (error) {
      this.logger.error('Failed to save learning data to database:', error);
    }
  }

  private groupByInstructionType(
    data: LearningDataPoint[] = this.learningData,
  ): Record<string, LearningDataPoint[]> {
    return data.reduce(
      (groups, item) => {
        const type = this.extractInstructionType(item.instruction);
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(item);
        return groups;
      },
      {} as Record<string, LearningDataPoint[]>,
    );
  }

  private extractInstructionType(instruction: string): string {
    const lowerInstruction = instruction.toLowerCase();

    if (
      lowerInstruction.includes('уведом') ||
      lowerInstruction.includes('notif')
    ) {
      return 'notification';
    }
    if (
      lowerInstruction.includes('коммент') ||
      lowerInstruction.includes('comment')
    ) {
      return 'comment';
    }
    if (
      lowerInstruction.includes('перенес') ||
      lowerInstruction.includes('move')
    ) {
      return 'move_task';
    }
    if (
      lowerInstruction.includes('анализ') ||
      lowerInstruction.includes('analyz')
    ) {
      return 'analysis';
    }
    if (
      lowerInstruction.includes('назнач') ||
      lowerInstruction.includes('assign')
    ) {
      return 'assignment';
    }

    return 'general';
  }

  private extractCommonFailures(failedData: LearningDataPoint[]): string[] {
    const failures: string[] = [];

    for (const data of failedData) {
      failures.push(...data.outcome.learningPoints);
    }

    return Array.from(new Set(failures)).slice(0, 5);
  }

  private generateRecommendations(
    instructionType: string,
    successRate: number,
    avgConfidence: number,
  ): string[] {
    const recommendations: string[] = [];

    if (successRate < 0.5) {
      recommendations.push(
        'Пересмотреть логику выполнения для данного типа инструкций',
      );
    }

    if (avgConfidence < 50) {
      recommendations.push('Добавить больше контекстной информации');
    }

    if (instructionType === 'notification' && successRate < 0.8) {
      recommendations.push(
        'Проверить настройки уведомлений и доступность сервисов',
      );
    }

    return recommendations;
  }

  private calculateImprovementTrend(
    data: LearningDataPoint[],
  ): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 5) return 'stable';

    const recent = data.slice(-5);
    const older = data.slice(-10, -5);

    const recentSuccess =
      recent.filter((d) => d.outcome.successful).length / recent.length;
    const olderSuccess =
      older.length > 0
        ? older.filter((d) => d.outcome.successful).length / older.length
        : recentSuccess;

    if (recentSuccess > olderSuccess + 0.1) return 'increasing';
    if (recentSuccess < olderSuccess - 0.1) return 'decreasing';
    return 'stable';
  }

  private identifyStrongestAreas(data: LearningDataPoint[]): string[] {
    const areaSuccess: Record<string, { total: number; successful: number }> =
      {};

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
      .sort(
        (a, b) =>
          areaSuccess[b].successful / areaSuccess[b].total -
          areaSuccess[a].successful / areaSuccess[a].total,
      )
      .slice(0, 3);
  }

  private identifyWeakestAreas(data: LearningDataPoint[]): string[] {
    const areaSuccess: Record<string, { total: number; successful: number }> =
      {};

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
      .sort(
        (a, b) =>
          areaSuccess[a].successful / areaSuccess[a].total -
          areaSuccess[b].successful / areaSuccess[b].total,
      )
      .slice(0, 3);
  }

  private generateImprovementSuggestions(data: LearningDataPoint[]): string[] {
    const suggestions: string[] = [];

    const failedActions = data.filter((d) => !d.outcome.successful);
    const avgConfidence =
      data.reduce((sum, d) => sum + d.decision.confidence, 0) / data.length;

    if (failedActions.length > data.length * 0.3) {
      suggestions.push(
        'Высокий процент неудачных действий - пересмотреть инструкции',
      );
    }

    if (avgConfidence < 60) {
      suggestions.push(
        'Низкая уверенность в решениях - добавить больше обучающих данных',
      );
    }

    const lowImpactActions = data.filter((d) => d.outcome.impactScore < 5);
    if (lowImpactActions.length > data.length * 0.5) {
      suggestions.push(
        'Много действий с низким влиянием - фокус на более значимых задачах',
      );
    }

    return suggestions;
  }

  private isSimilarContext(
    context1: LearningDataPoint['context'],
    context2: LearningDataPoint['context'],
  ): boolean {
    return (
      context1.taskType === context2.taskType &&
      context1.urgency === context2.urgency &&
      context1.columnName === context2.columnName
    );
  }

  private generatePredictionRecommendations(
    similarCases: LearningDataPoint[],
    successRate: number,
  ): string[] {
    const recommendations: string[] = [];

    if (successRate < 0.5) {
      recommendations.push(
        'Низкая вероятность успеха - рассмотреть альтернативные подходы',
      );
    }

    if (successRate > 0.8) {
      recommendations.push(
        'Высокая вероятность успеха - можно выполнять с уверенностью',
      );
    }

    const avgConfidence =
      similarCases.reduce((sum, c) => sum + c.decision.confidence, 0) /
      similarCases.length;
    if (avgConfidence < 60) {
      recommendations.push(
        'Исторически низкая уверенность - добавить дополнительные проверки',
      );
    }

    return recommendations;
  }

  private calculateFrequency(items: string[]): Record<string, number> {
    return items.reduce(
      (freq, item) => {
        freq[item] = (freq[item] || 0) + 1;
        return freq;
      },
      {} as Record<string, number>,
    );
  }
}
