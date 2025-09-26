export interface IWebhookValidationResult {
  shouldProcess: boolean;
  reason: string;
}

export interface IPhotoData {
  filename: string;
  content: string; // base64
  url: string;
}

export interface IPhotoExtractionResult {
  success: boolean;
  message: string;
  beforePhoto?: IPhotoData;
  afterPhoto?: IPhotoData;
}

export interface IClaudeAnalysisData {
  transformation: {
    category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';
    difficultyLevel: number; // 1-10
    visualChanges: string[];
    technique: string;
  };
  quality: {
    overallScore: number; // 1-10
    evenness: number;
    transitions: number;
    symmetry: number;
    cleanliness: number;
    styleCompliance: number;
  };
  recommendations: string[];
}

export interface IClaudeAnalysisResult {
  success: boolean;
  message: string;
  analysis: IClaudeAnalysisData | null;
}

export interface IWebhookProcessingResult {
  success: boolean;
  message: string;
  processed: boolean;
  taskKey?: string;
  analysis?: IClaudeAnalysisData;
  error?: string;
  timestamp: string;
}

export interface IJiraCommentRequest {
  taskKey: string;
  comment: string;
}

export interface IServiceHealthCheck {
  status: 'healthy' | 'unhealthy';
  claudeEndpoint: string;
  timestamp: string;
  dependencies?: {
    jiraApi: boolean;
    claudeService: boolean;
  };
}

export interface IWebhookMetrics {
  totalProcessed: number;
  successfulProcessed: number;
  failedProcessed: number;
  averageProcessingTime: number;
  claudeAnalysisSuccess: number;
  claudeAnalysisFailures: number;
}

export interface IWebhookConfig {
  triggerStatuses: string[];
  haircutKeywords: string[];
  maxPhotoSize: number;
  allowedPhotoFormats: string[];
  analysisTimeout: number;
}
