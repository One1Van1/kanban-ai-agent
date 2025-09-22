export interface AddTaskCommentResponse {
  success: boolean;
  taskKey: string;
  message: string;
  error?: string;
}
