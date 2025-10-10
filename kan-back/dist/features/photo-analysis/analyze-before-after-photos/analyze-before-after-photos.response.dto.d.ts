interface AnalysisResult {
    clientInfo: {
        gender: string;
        haircutStyle: string;
    };
    transformation: {
        category: string;
        difficultyLevel: number;
    };
    quality: {
        overallScore: number;
        technicalExecution: number;
        creativity: number;
        clientSatisfaction: number;
    };
    improvements: string[];
    compliance: boolean;
    notes: string;
    confidenceLevel: number;
}
export declare class AnalyzeBeforeAfterPhotosResponseDto {
    success: boolean;
    taskKey: string;
    message: string;
    analysis: AnalysisResult;
    processedAt: string;
    constructor(success: boolean, taskKey: string, message: string, analysis: AnalysisResult);
}
export {};
