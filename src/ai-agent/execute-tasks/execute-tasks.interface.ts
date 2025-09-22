export interface ExecuteTasksResponse {
  tasksExecuted: number;
  successfulExecutions: number;
  results: ExecuteTaskResult[];
}

export interface ExecuteTaskResult {
  taskKey: string;
  executed: boolean;
  success: boolean;
  reason: string;
  filesCreated?: string[];
  error?: string;
}

export interface EntityCreationResult {
  entityName: string;
  filePath: string;
  fields: string[];
}
