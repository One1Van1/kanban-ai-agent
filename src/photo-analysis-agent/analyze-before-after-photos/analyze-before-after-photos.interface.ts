/**
 * Интерфейс для анализа фотографий ДО/ПОСЛЕ
 */
export interface IBeforeAfterAnalysis {
  /**
   * Анализ трансформации волос
   */
  transformation: {
    category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';
    difficultyLevel: number;
    visualChanges: string[];
    technique: string;
  };

  /**
   * Оценка качества работы
   */
  quality: {
    overallScore: number;
    evenness: number;
    transitions: number;
    symmetry: number;
    cleanliness: number;
    styleCompliance: number;
  };

  /**
   * Анализ времени выполнения
   */
  timeAnalysis: {
    actualMinutes: number;
    expectedRange: string;
    efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';
  };

  /**
   * Итоговый отчет
   */
  report: {
    summary: string;
    strengths: string[];
    improvements: string[];
    finalPrice: number;
  };
}

/**
 * Интерфейс для Claude Vision сервиса
 */
export interface IClaudeVisionService {
  /**
   * Анализ двух изображений (ДО и ПОСЛЕ)
   */
  analyzeBeforeAfterPhotos(
    beforeImageBase64: string,
    afterImageBase64: string,
    taskKey: string,
    timeInMinutes?: number,
  ): Promise<IBeforeAfterAnalysis>;

  /**
   * Проверка доступности сервиса
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Интерфейс для основного сервиса анализа
 */
export interface IAnalyzeBeforeAfterPhotosService {
  /**
   * Основной метод анализа фотографий
   */
  analyze(
    taskKey: string,
    beforePhoto: { filename: string; content: string; size?: number },
    afterPhoto: { filename: string; content: string; size?: number },
    timeInProgress?: number,
  ): Promise<IBeforeAfterAnalysis>;

  /**
   * Валидация входящих данных
   */
  validatePhotos(
    beforePhoto: { filename: string; content: string },
    afterPhoto: { filename: string; content: string },
  ): Promise<boolean>;
}

/**
 * Константы для анализа
 */
export const HAIRCUT_CATEGORIES = {
  FAST: 'Быстрая стрижка',
  REGULAR: 'Обычная стрижка',
  COMPLEX: 'Сложная стрижка',
} as const;

export const TIME_RANGES = {
  [HAIRCUT_CATEGORIES.FAST]: { min: 15, max: 30 },
  [HAIRCUT_CATEGORIES.REGULAR]: { min: 30, max: 60 },
  [HAIRCUT_CATEGORIES.COMPLEX]: { min: 60, max: 120 },
} as const;

export const PRICING = {
  [HAIRCUT_CATEGORIES.FAST]: { base: 500, discount: 0.1 },
  [HAIRCUT_CATEGORIES.REGULAR]: { base: 800, discount: 0.05 },
  [HAIRCUT_CATEGORIES.COMPLEX]: { base: 1500, discount: 0 },
} as const;
