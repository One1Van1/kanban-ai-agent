export interface KanbanPattern {
    name: string;
    description: string;
    triggers: string[];
    actions: string[];
    successCriteria: string[];
    riskFactors: string[];
    examples: string[];
}
export interface BusinessRule {
    id: string;
    name: string;
    condition: string;
    action: string;
    priority: number;
    applicableColumns: string[];
    taskTypes: string[];
}
export interface IndustryBestPractice {
    industry: string;
    practice: string;
    description: string;
    implementation: string[];
    benefits: string[];
}
export declare class KanbanKnowledgeBaseService {
    private readonly logger;
    private readonly patterns;
    private readonly businessRules;
    private readonly industryPractices;
    findMatchingPattern(taskType: string, keywords: string[], columnName: string): KanbanPattern | null;
    getApplicableBusinessRules(taskType: string, columnName: string, taskData: any): BusinessRule[];
    getIndustryBestPractices(industry?: string): IndustryBestPractice[];
    getOptimizationRecommendations(taskType: string, columnName: string, timeInColumn: number): string[];
    private calculatePatternMatch;
    addPattern(pattern: KanbanPattern): void;
    addBusinessRule(rule: BusinessRule): void;
    addBestPractice(practice: IndustryBestPractice): void;
    getKnowledgeBaseStats(): {
        patterns: number;
        businessRules: number;
        bestPractices: number;
    };
}
