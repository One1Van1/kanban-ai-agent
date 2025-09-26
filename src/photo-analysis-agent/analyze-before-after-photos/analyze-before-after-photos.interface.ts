export interface IPhotoData {
  url?: string;
  content?: string; // base64
  filename?: string;
}

export interface IBeforeAfterPhotos {
  beforePhoto: IPhotoData;
  afterPhoto: IPhotoData;
}

export interface IHaircutTransformation {
  category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';
  difficultyLevel: number; // 1-10
  visualChanges: string[];
  technique: string;
}

export interface IQualityScores {
  overallScore: number; // 1-10
  evenness: number; // Ровность стрижки
  transitions: number; // Плавность переходов
  symmetry: number; // Симметричность
  cleanliness: number; // Чистота работы
  styleCompliance: number; // Соответствие стилю
}

export interface IBeforeAfterAnalysisResult {
  transformation: IHaircutTransformation;
  quality: IQualityScores;
  recommendations: string[];
  processingTime?: number; // ms
  claudeModel?: string;
}

export interface IAnalyzeBeforeAfterResponse {
  success: boolean;
  message: string;
  analysis: IBeforeAfterAnalysisResult | null;
  error?: string;
  metadata?: {
    taskKey: string;
    timestamp: string;
    processingTime: number;
  };
}
