export interface CheckProgressTasksResponse {
  tasksChecked: number;
  tasksMoved: number;
  results: Array<{
    taskKey: string;
    decision: string;
    reason: string;
    moved: boolean;
  }>;
}
