import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AgentLearningService } from './agent-learning.service';

class GetAgentMetricsResponseDto {
  agentId: string;
  totalDecisions: number;
  successRate: number;
  averageConfidence: number;
  improvementTrend: 'increasing' | 'decreasing' | 'stable';
  strongestAreas: string[];
  weakestAreas: string[];
  suggestedImprovements: string[];
}

class RecordFeedbackRequestDto {
  dataPointId: string;
  userFeedback: 'positive' | 'negative' | 'neutral';
  additionalNotes?: string;
}

class GetPatternsResponseDto {
  pattern: string;
  frequency: number;
  successRate: number;
  averageConfidence: number;
  commonFailures: string[];
  recommendations: string[];
}

@ApiTags('AI Agent Learning')
@Controller('ai-agent/learning')
export class AgentLearningController {
  private readonly logger = new Logger(AgentLearningController.name);

  constructor(private readonly learningService: AgentLearningService) {}

  @Get(':agentId/metrics')
  @ApiOperation({
    summary: 'Получить метрики производительности агента',
    description:
      'Возвращает детальные метрики обучения и производительности агента',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiResponse({
    status: 200,
    description: 'Метрики агента получены успешно',
    type: GetAgentMetricsResponseDto,
  })
  async getAgentMetrics(
    @Param('agentId') agentId: string,
  ): Promise<GetAgentMetricsResponseDto> {
    this.logger.log(`📊 Getting performance metrics for agent: ${agentId}`);

    const metrics =
      await this.learningService.getAgentPerformanceMetrics(agentId);

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

  @Get('patterns')
  @ApiOperation({
    summary: 'Получить анализ паттернов обучения',
    description: 'Возвращает анализ паттернов успеха и неудач всех агентов',
  })
  @ApiResponse({
    status: 200,
    description: 'Паттерны получены успешно',
    type: [GetPatternsResponseDto],
  })
  async getPatterns(): Promise<GetPatternsResponseDto[]> {
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

  @Post('feedback')
  @ApiOperation({
    summary: 'Записать обратную связь пользователя',
    description:
      'Позволяет пользователю оценить качество работы агента для улучшения обучения',
  })
  @ApiResponse({
    status: 200,
    description: 'Обратная связь записана успешно',
  })
  async recordFeedback(
    @Body() request: RecordFeedbackRequestDto,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `🔄 Recording user feedback: ${request.userFeedback} for ${request.dataPointId}`,
    );

    await this.learningService.updateLearningFromFeedback(
      request.dataPointId,
      request.userFeedback,
      request.additionalNotes,
    );

    return {
      success: true,
      message: 'Обратная связь записана и будет учтена при обучении агента',
    };
  }

  @Get(':agentId/recommendations')
  @ApiOperation({
    summary: 'Получить рекомендации по улучшению агента',
    description:
      'Возвращает персонализированные рекомендации по улучшению работы агента',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiResponse({
    status: 200,
    description: 'Рекомендации получены успешно',
  })
  async getImprovementRecommendations(
    @Param('agentId') agentId: string,
  ): Promise<{ recommendations: string[] }> {
    this.logger.log(
      `💡 Getting improvement recommendations for agent: ${agentId}`,
    );

    const recommendations =
      await this.learningService.getImprovementRecommendations(agentId);

    return { recommendations };
  }

  @Get('best-practices')
  @ApiOperation({
    summary: 'Получить лучшие практики на основе обучения',
    description: 'Возвращает выявленные лучшие практики работы агентов',
  })
  @ApiResponse({
    status: 200,
    description: 'Лучшие практики получены успешно',
  })
  async getBestPractices(): Promise<{
    mostSuccessfulInstructions: string[];
    optimalConfidenceLevels: { min: number; max: number };
    bestContextTypes: string[];
  }> {
    this.logger.log('🏆 Getting best practices from learning data...');

    const bestPractices = await this.learningService.getBestPractices();

    return bestPractices;
  }

  @Get(':agentId/predict/:instructionType')
  @ApiOperation({
    summary: 'Предсказать успешность действия агента',
    description:
      'Предсказывает вероятность успешного выполнения действия на основе истории',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiParam({ name: 'instructionType', description: 'Тип инструкции' })
  @ApiResponse({
    status: 200,
    description: 'Предсказание выполнено успешно',
  })
  async predictActionSuccess(
    @Param('agentId') agentId: string,
    @Param('instructionType') instructionType: string,
    @Body()
    context: {
      taskType: string;
      urgency: string;
      complexity: string;
      columnName: string;
      triggerType: string;
    },
  ): Promise<{
    predictedSuccessRate: number;
    confidence: number;
    recommendations: string[];
  }> {
    this.logger.log(
      `🎯 Predicting success for agent ${agentId}, instruction: ${instructionType}`,
    );

    const prediction = await this.learningService.predictActionSuccess(
      agentId,
      instructionType,
      context,
    );

    return prediction;
  }
}
