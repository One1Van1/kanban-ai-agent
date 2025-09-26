/**
 * Интерфейс для трекинга рабочего времени
 */
export interface IWorkTimeTracking {
  taskKey: string;
  totalMinutes: number;
  statusHistory: IStatusTime[];
  worklogEntries: IWorklogEntry[];
  efficiency: ITimeEfficiency;
  createdAt: string;
  updatedAt: string;
  currentStatus: string;
}

/**
 * Интерфейс времени в статусе
 */
export interface IStatusTime {
  statusName: string;
  statusId: string;
  enteredAt: string;
  exitedAt: string | null;
  durationMinutes: number;
}

/**
 * Интерфейс worklog записи
 */
export interface IWorklogEntry {
  id: string;
  author: string;
  started: string;
  timeSpentSeconds: number;
  timeSpentMinutes: number;
  comment: string | null;
}

/**
 * Интерфейс анализа эффективности времени
 */
export interface ITimeEfficiency {
  totalWorkMinutes: number;
  expectedRange: string;
  efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';
  efficiencyPercentage: number;
  recommendations: string[];
}

/**
 * Интерфейс сервиса трекинга времени
 */
export interface ITrackWorkTimeService {
  /**
   * Получить полную информацию о времени работы над задачей
   */
  getWorkTimeTracking(
    taskKey: string,
    startDate?: string,
    endDate?: string,
  ): Promise<IWorkTimeTracking>;

  /**
   * Получить историю статусов задачи
   */
  getStatusHistory(taskKey: string): Promise<IStatusTime[]>;

  /**
   * Получить worklog записи задачи
   */
  getWorklogEntries(taskKey: string): Promise<IWorklogEntry[]>;

  /**
   * Анализировать эффективность времени
   */
  analyzeTimeEfficiency(
    totalMinutes: number,
    taskSummary?: string,
  ): Promise<ITimeEfficiency>;
}

/**
 * Интерфейс Jira сервиса для времени
 */
export interface IJiraTimeService {
  /**
   * Получить changelog задачи для анализа статусов
   */
  getTaskChangelog(taskKey: string): Promise<any[]>;

  /**
   * Получить worklog задачи
   */
  getTaskWorklog(taskKey: string): Promise<any[]>;

  /**
   * Получить информацию о задаче
   */
  getTaskInfo(taskKey: string): Promise<{
    summary: string;
    created: string;
    updated: string;
    status: { name: string; id: string };
  }>;
}

/**
 * Константы для анализа времени
 */
export const TIME_STANDARDS = {
  // Стандартное время для разных типов стрижек
  'быстрая стрижка': { min: 15, max: 30, optimal: 22 },
  'обычная стрижка': { min: 30, max: 60, optimal: 45 },
  'сложная стрижка': { min: 60, max: 120, optimal: 90 },
  'стрижка под насадку': { min: 10, max: 25, optimal: 18 },
  'модельная стрижка': { min: 90, max: 150, optimal: 120 },
} as const;

/**
 * Константы для определения эффективности
 */
export const EFFICIENCY_THRESHOLDS = {
  EXCELLENT: 0.8, // 80% от оптимального времени или меньше
  GOOD: 1.0, // До 100% оптимального времени
  ACCEPTABLE: 1.3, // До 130% оптимального времени
  SLOW: Infinity, // Больше 130% оптимального времени
} as const;

/**
 * Константы статусов Jira
 */
export const JIRA_STATUSES = {
  NEW: 'New',
  BACKLOG: 'backlog',
  QUESTIONS: 'Questions',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
} as const;

/**
 * Маппинг статусов для расчета рабочего времени
 */
export const WORK_STATUSES = [
  JIRA_STATUSES.IN_PROGRESS,
  // Можно добавить другие статусы которые считаются "рабочими"
] as const;

/**
 * Утилиты для работы с временем
 */
export const TimeUtils = {
  /**
   * Конвертация секунд в минуты
   */
  secondsToMinutes: (seconds: number): number => Math.round(seconds / 60),

  /**
   * Конвертация миллисекунд в минуты
   */
  msToMinutes: (ms: number): number => Math.round(ms / 1000 / 60),

  /**
   * Расчет разницы между датами в минутах
   */
  getMinutesBetween: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.round((end.getTime() - start.getTime()) / 1000 / 60);
  },

  /**
   * Форматирование времени для отображения
   */
  formatMinutes: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}мин`;
  },

  /**
   * Определение типа стрижки из summary задачи
   */
  detectHaircutType: (summary: string): keyof typeof TIME_STANDARDS => {
    const lowerSummary = summary.toLowerCase();

    if (lowerSummary.includes('быстрая') || lowerSummary.includes('быстро')) {
      return 'быстрая стрижка';
    }
    if (
      lowerSummary.includes('под насадку') ||
      lowerSummary.includes('насадка')
    ) {
      return 'стрижка под насадку';
    }
    if (lowerSummary.includes('сложна') || lowerSummary.includes('модель')) {
      return 'сложная стрижка';
    }
    if (lowerSummary.includes('модельн')) {
      return 'модельная стрижка';
    }

    // По умолчанию - обычная стрижка
    return 'обычная стрижка';
  },
};
