import { AgentLearningService } from './agent-learning.service';
declare class GetAgentMetricsResponseDto {
    agentId: string;
    totalDecisions: number;
    successRate: number;
    averageConfidence: number;
    improvementTrend: 'increasing' | 'decreasing' | 'stable';
    strongestAreas: string[];
    weakestAreas: string[];
    suggestedImprovements: string[];
}
declare class RecordFeedbackRequestDto {
    dataPointId: string;
    userFeedback: 'positive' | 'negative' | 'neutral';
    additionalNotes?: string;
}
declare class GetPatternsResponseDto {
    pattern: string;
    frequency: number;
    successRate: number;
    averageConfidence: number;
    commonFailures: string[];
    recommendations: string[];
}
export declare class AgentLearningController {
    private readonly learningService;
    private readonly logger;
    constructor(learningService: AgentLearningService);
    getAgentMetrics(agentId: string): Promise<GetAgentMetricsResponseDto>;
    getPatterns(): Promise<GetPatternsResponseDto[]>;
    recordFeedback(request: RecordFeedbackRequestDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getImprovementRecommendations(agentId: string): Promise<{
        recommendations: string[];
    }>;
    getBestPractices(): Promise<{
        mostSuccessfulInstructions: string[];
        optimalConfidenceLevels: {
            min: number;
            max: number;
        };
        bestContextTypes: string[];
    }>;
    predictActionSuccess(agentId: string, instructionType: string, context: {
        taskType: string;
        urgency: string;
        complexity: string;
        columnName: string;
        triggerType: string;
    }): Promise<{
        predictedSuccessRate: number;
        confidence: number;
        recommendations: string[];
    }>;
}
export {};
