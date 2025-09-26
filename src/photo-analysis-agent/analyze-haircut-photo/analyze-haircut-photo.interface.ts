export interface PhotoAnalysisResult {
  taskKey: string;
  analysisId: string;
  timestamp: Date;

  // Анализ фото
  photoAnalysis: {
    qualityScore: number; // 1-10
    categoryMatch: boolean;
    detectedCategory: string;
    technicalExecution: 'excellent' | 'good' | 'satisfactory' | 'poor';

    // Детальная оценка
    details: {
      evenness: number; // Ровность стрижки 1-10
      transitions: number; // Плавность переходов 1-10
      symmetry: number; // Симметричность 1-10
      cleanliness: number; // Чистота работы 1-10
      styleCompliance: number; // Соответствие стилю 1-10
    };

    // Найденные проблемы
    issues: string[];

    // Положительные моменты
    highlights: string[];
  };

  // Соответствие заявленной категории
  categoryVerification: {
    matches: boolean;
    confidence: number; // 0-1
    reasoning: string;
    suggestedCategory?: string;
  };

  // Итоговая оценка
  overallAssessment: {
    passed: boolean;
    score: number; // 1-10
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    feedback: string;
    recommendations: string[];
  };

  // Действия для Jira
  jiraActions: {
    shouldMoveToQuestions: boolean;
    shouldMoveToDone: boolean;
    commentToAdd: string;
    categoryUpdate?: string;
  };
}

export interface AnalyzeHaircutPhotoResponse {
  success: boolean;
  message: string;
  analysis?: PhotoAnalysisResult;
  error?: string;
}
