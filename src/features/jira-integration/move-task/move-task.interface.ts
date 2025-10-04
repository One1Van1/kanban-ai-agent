export interface MoveTaskResponse {
  success: boolean;
  taskKey: string;
  fromStatus: string;
  toStatus: string;
  transitionId?: string;
  message?: string;
}
