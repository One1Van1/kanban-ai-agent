// export interface TaskAnalysisResult {
//   taskKey: string;
//   isUnderstandable: boolean;
//   decision: 'move_to_progress' | 'move_to_questions' | 'stay_in_new';
//   reason: string;
//   suggestedComment?: string;
// }

// export interface TaskProgressResult {
//   taskKey: string;
//   isCompleted: boolean;
//   decision: 'move_to_review' | 'stay_in_progress';
//   reason: string;
//   suggestedComment?: string;
// }

// export interface WorkflowExecutionResult {
//   newTasksProcessed: TaskAnalysisResult[];
//   progressTasksProcessed: TaskProgressResult[];
//   totalTasksMoved: number;
//   errors: string[];
//   timestamp: string;
// }
