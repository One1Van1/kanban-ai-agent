import { TaskHistory } from '@/entities/task-history.entity';
import { Repository } from 'typeorm';
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
        impactScore: number;
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
export declare class AgentLearningService {
    private readonly taskHistoryRepository;
    private readonly logger;
    private readonly learningData;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    recordLearningData(data: Omit<LearningDataPoint, 'id' | 'timestamp'>): Promise<void>;
    analyzePatterns(): Promise<PatternInsight[]>;
    getAgentPerformanceMetrics(agentId: string): Promise<AgentPerformanceMetrics>;
    predictActionSuccess(agentId: string, instructionType: string, context: LearningDataPoint['context']): Promise<{
        predictedSuccessRate: number;
        confidence: number;
        recommendations: string[];
    }>;
    updateLearningFromFeedback(dataPointId: string, userFeedback: 'positive' | 'negative' | 'neutral', additionalNotes?: string): Promise<void>;
    getImprovementRecommendations(agentId: string): Promise<string[]>;
    getBestPractices(): Promise<{
        mostSuccessfulInstructions: string[];
        optimalConfidenceLevels: {
            min: number;
            max: number;
        };
        bestContextTypes: string[];
    }>;
    private generateId;
    private saveToDatabase;
    private groupByInstructionType;
    private extractInstructionType;
    private extractCommonFailures;
    private generateRecommendations;
    private calculateImprovementTrend;
    private identifyStrongestAreas;
    private identifyWeakestAreas;
    private generateImprovementSuggestions;
    private isSimilarContext;
    private generatePredictionRecommendations;
    private calculateFrequency;
}
