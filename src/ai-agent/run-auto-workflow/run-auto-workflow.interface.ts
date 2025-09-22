export interface RunAutoWorkflowResponse {
  timestamp: string;
  newTasks: {
    analyzed: number;
    moved: number;
  };
  progressTasks: {
    checked: number;
    moved: number;
  };
  executedTasks: {
    executed: number;
    successful: number;
  };
  totalMoved: number;
  duration: number; // в миллисекундах
}
