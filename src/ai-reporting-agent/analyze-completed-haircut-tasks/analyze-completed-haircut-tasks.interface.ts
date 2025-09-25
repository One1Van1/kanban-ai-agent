/**
 * Интерфейсы для анализа выполненных задач по стрижкам
 */

/**
 * Категории стрижек
 */
export enum HaircutCategory {
  FAST = 'Быстрая стрижка',
  REGULAR = 'Обычная стрижка',
  CREATIVE = 'Креативная стрижка',
}

/**
 * Временные нормативы для категорий стрижек (в минутах)
 */
export const HAIRCUT_TIME_LIMITS = {
  [HaircutCategory.FAST]: { min: 20, max: 30 },
  [HaircutCategory.REGULAR]: { min: 30, max: 60 },
  [HaircutCategory.CREATIVE]: { min: 90, max: Infinity },
};

/**
 * Базовые цены на стрижки (в рублях)
 */
export const HAIRCUT_PRICES = {
  [HaircutCategory.FAST]: 400,
  [HaircutCategory.REGULAR]: 800,
  [HaircutCategory.CREATIVE]: 1500,
};

/**
 * Тип клиента
 */
export enum ClientType {
  REGULAR = 'постоянный',
  NEW = 'не постоянный',
}

/**
 * Статус анализа времени
 */
export enum TimeAnalysisStatus {
  WITHIN_NORM = 'в пределах нормы',
  EXCEEDED = 'превышено',
  UNDER_NORM = 'меньше нормы',
}

/**
 * Входные данные для анализа
 */
export interface HaircutTaskAnalysisInput {
  issueKey: string;
  taskTitle: string;
  taskDescription: string; // категория стрижки
  employeeComment: string; // отчёт сотрудника
  actualTimeMinutes: number; // фактическое время выполнения
}

/**
 * Результат анализа времени выполнения
 */
export interface TimeAnalysisResult {
  status: TimeAnalysisStatus;
  actualTime: number;
  normativeTime: { min: number; max: number };
  deviation?: number; // отклонение в минутах (если есть превышение)
}

/**
 * Информация о клиенте
 */
export interface ClientInfo {
  type: ClientType;
  isRegular: boolean;
  discountPercent: number;
}

/**
 * Информация о категории (может быть обновлена в процессе анализа)
 */
export interface CategoryInfo {
  original: HaircutCategory;
  updated?: HaircutCategory;
  wasUpdated: boolean;
  updateReason?: string;
}

/**
 * Расчёт стоимости
 */
export interface PriceCalculation {
  basePrice: number;
  discount: number;
  finalPrice: number;
  category: HaircutCategory;
}

/**
 * Объяснение превышения времени
 */
export interface TimeExplanation {
  hasExplanation: boolean;
  reason?: string;
  categoryChangeRequested?: HaircutCategory;
  isValid: boolean;
}

/**
 * Результат анализа задачи
 */
export interface HaircutTaskAnalysisResult {
  issueKey: string;
  success: boolean;

  // Анализ категории
  category: CategoryInfo;

  // Анализ времени
  timeAnalysis: TimeAnalysisResult;

  // Информация о клиенте
  client: ClientInfo;

  // Объяснение (если есть превышение)
  explanation?: TimeExplanation;

  // Расчёт стоимости
  price: PriceCalculation;

  // Действия агента
  requiresQuestion: boolean; // нужно ли задать вопрос сотруднику
  moveToQuestions: boolean; // нужно ли переместить в колонку questions

  // Сообщения
  agentComment?: string; // комментарий/вопрос агента
  finalReport: string; // итоговый отчёт

  // Метаданные
  timestamp: string;
  processingTimeMs: number;
}

/**
 * DTO для получения данных из Jira
 */
export interface JiraTaskData {
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      name: string;
    };
    timetracking?: {
      timeSpentSeconds: number;
    };
    worklog?: {
      worklogs: Array<{
        timeSpentSeconds: number;
        started: string;
      }>;
    };
    comment?: {
      comments: Array<{
        body: string;
        created: string;
        author: {
          displayName: string;
        };
      }>;
    };
  };
}

/**
 * Ключевые слова для определения объяснений превышения времени
 */
export const EXPLANATION_KEYWORDS = [
  'клиент был сложный',
  'клиент был нервный',
  'постоянно двигался',
  'технические проблемы',
  'просил дополнительные услуги',
  'пришлось переделывать',
  'на самом деле это была',
  'по факту получилась',
  'в итоге',
  'фактически',
];

/**
 * Ключевые слова для определения смены категории
 */
export const CATEGORY_CHANGE_KEYWORDS = [
  'на самом деле',
  'по факту',
  'в итоге',
  'фактически',
  'получилась',
  'была',
];

/**
 * Ключевые слова для определения типа клиента
 */
export const CLIENT_TYPE_KEYWORDS = {
  [ClientType.REGULAR]: ['постоянный клиент', 'постоянный', 'регулярный'],
  [ClientType.NEW]: ['не постоянный', 'новый клиент', 'первый раз'],
};

/**
 * Конфигурация скидок
 */
export const DISCOUNT_CONFIG = {
  REGULAR_CLIENT_PERCENT: 10,
};
