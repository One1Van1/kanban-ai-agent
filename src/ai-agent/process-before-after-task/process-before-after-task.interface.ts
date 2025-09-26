/**
 * Интерфейсы для процесса анализа задач "до и после" стрижки
 */

/**
 * Конфигурация для обработки задач
 */
export interface ProcessTaskConfig {
  forcePhotoAnalysis: boolean;
  forceTimeUpdate: boolean;
  addCommentToTask: boolean;
  timeoutMs: number; // Максимальное время обработки одной задачи
}

/**
 * Результат анализа фотографий (из PhotoAnalysisAgent)
 */
export interface PhotoAnalysisResult {
  success: boolean;
  category: string;
  qualityScore: number;
  description: string;
  recommendations: string[];
  confidence: number;
  processingTimeMs: number;
  error?: string;
}

/**
 * Результат анализа времени работы (из TrackWorkTimeService)
 */
export interface TimeAnalysisResult {
  success: boolean;
  taskKey: string;
  totalMinutes: number;
  efficiency: 'excellent' | 'good' | 'average' | 'slow' | 'very_slow';
  efficiencyPercentage: number;
  expectedRange: string;
  recommendations: string[];
  statusHistory: any[];
  worklogEntries: any[];
  error?: string;
}

/**
 * Сводный анализ качества и эффективности
 */
export interface CombinedAnalysis {
  overallScore: number; // 1-10, комбинация качества и эффективности
  summary: string;
  recommendations: string[];
  qualityWeight: number; // Вес качества в общей оценке (0-1)
  timeWeight: number; // Вес времени в общей оценке (0-1)
  categories: {
    photoQuality: string; // Категория качества фото
    timeEfficiency: string; // Категория эффективности времени
    combined: string; // Общая категория
  };
}

/**
 * Состояние обработки задачи
 */
export interface TaskProcessState {
  taskKey: string;
  status: 'not_processed' | 'in_progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  lastProcessedAt?: Date;
  processSteps: {
    photoAnalysis: 'pending' | 'in_progress' | 'completed' | 'failed';
    timeAnalysis: 'pending' | 'in_progress' | 'completed' | 'failed';
    combinedAnalysis: 'pending' | 'in_progress' | 'completed' | 'failed';
    commentAdding:
      | 'pending'
      | 'in_progress'
      | 'completed'
      | 'failed'
      | 'skipped';
  };
  errors: string[];
  result?: ProcessTaskResult;
}

/**
 * Результат полной обработки одной задачи
 */
export interface ProcessTaskResult {
  taskKey: string;
  processedAt: Date;
  success: boolean;
  photoAnalysis: PhotoAnalysisResult;
  timeAnalysis: TimeAnalysisResult;
  combinedAnalysis: CombinedAnalysis;
  commentId?: string;
  processingTimeMs: number;
  errors: string[];
}

/**
 * Параметры для создания комментария в Jira
 */
export interface CommentCreationParams {
  taskKey: string;
  photoAnalysis: PhotoAnalysisResult;
  timeAnalysis: TimeAnalysisResult;
  combinedAnalysis: CombinedAnalysis;
}

/**
 * Форматированный комментарий для Jira
 */
export interface FormattedComment {
  body: string;
  visibility?: {
    type: string;
    value: string;
  };
}

/**
 * Конфигурация весов для сводного анализа
 */
export interface AnalysisWeights {
  quality: number; // Вес качества фотографий (0-1)
  time: number; // Вес эффективности времени (0-1)
  // Дополнительные веса для будущих критериев
  complexity?: number; // Вес сложности стрижки
  customerSatisfaction?: number; // Вес удовлетворенности клиента
}

/**
 * Пороговые значения для категоризации результатов
 */
export interface AnalysisThresholds {
  excellent: { min: number; max: number };
  good: { min: number; max: number };
  average: { min: number; max: number };
  poor: { min: number; max: number };
}

/**
 * Метрики производительности сервиса
 */
export interface ProcessingMetrics {
  totalProcessed: number;
  successfulProcessed: number;
  failedProcessed: number;
  averageProcessingTimeMs: number;
  photoAnalysisSuccessRate: number;
  timeAnalysisSuccessRate: number;
  lastProcessedAt?: Date;
  errors: {
    photoAnalysisErrors: number;
    timeAnalysisErrors: number;
    jiraCommentErrors: number;
    otherErrors: number;
  };
}

/**
 * Кэш результатов обработки
 */
export interface ProcessingCache {
  taskKey: string;
  photoAnalysisResult?: PhotoAnalysisResult;
  timeAnalysisResult?: TimeAnalysisResult;
  combinedAnalysisResult?: CombinedAnalysis;
  cachedAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

/**
 * Конфигурация HTTP-клиентов для взаимодействия с другими сервисами
 */
export interface HttpClientConfig {
  photoAnalysisService: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  timeTrackingService: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  jiraService: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
}

/**
 * Параметры retry-логики
 */
export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  exponentialBackoff: boolean;
  retryableErrors: string[]; // Коды ошибок, при которых стоит повторить
}

/**
 * Результат проверки здоровья сервиса
 */
export interface ProcessServiceHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    photoAnalysis: boolean;
    timeTracking: boolean;
    jira: boolean;
  };
  metrics: ProcessingMetrics;
  cache: {
    size: number;
    hitRate: number;
  };
  errors: string[];
}
