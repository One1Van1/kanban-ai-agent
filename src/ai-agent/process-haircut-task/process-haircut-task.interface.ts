export interface ProcessHaircutTaskResponse {
  processed: boolean;
  action: ProcessingAction;
  reason?: string;
  taskKey?: string;
  masterName?: string;
  timeValidation?: {
    hasTime: boolean;
    totalMinutes: number;
    sufficientTime: boolean;
  };
  analysis?: HaircutAnalysis;
  analysisResult?: {
    category: string;
    timeStatus: string;
    priceCalculation: number;
    recommendations: string[];
  };
  jiraActions?: {
    transitionExecuted: boolean;
    commentAdded: boolean;
    transitionId?: string;
  };
  error?: {
    message: string;
    details?: string;
  };
}

export interface HaircutAnalysis {
  category: string | null;
  actualTimeMinutes: number;
  expectedTimeRange: string;
  timeStatus: 'within_norm' | 'exceeded' | 'insufficient' | 'unknown';
  hasExplanation: boolean;
  explanation?: string;
  isRegularClient: boolean;
  basePrice: number;
  discount: number;
  finalPrice: number;
  needsQuestion: boolean;
  questionComment?: string;
  finalReport?: string;

  // Photo analysis results (optional - only when photos are attached)
  photoAnalysis?: {
    hasPhotos: boolean;
    photosAnalyzed: number;
    overallPhotoScore: number; // 1-10
    photoQualityDetails: {
      evenness: number;
      transitions: number;
      symmetry: number;
      cleanliness: number;
      styleCompliance: number;
    };
    photoIssues: string[];
    photoHighlights: string[];
    categoryFromPhoto?: string;
    photoAnalysisComplete: boolean;
  };
}

export interface WorklogEntry {
  timeSpentSeconds: number;
  started: string;
  author?: {
    displayName: string;
  };
  comment?: string;
}

export interface CommentEntry {
  body: string;
  author?: {
    displayName: string;
  };
  created?: string;
}

export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
  QUESTIONS = 'Questions',
}

export enum ProcessingAction {
  SKIPPED = 'skipped',
  RETURNED_TO_PROGRESS = 'returned_to_progress',
  MOVED_TO_DONE = 'moved_to_done',
  MOVED_TO_QUESTIONS = 'moved_to_questions',
  ANALYZED = 'analyzed',
  ERROR = 'error',
}
