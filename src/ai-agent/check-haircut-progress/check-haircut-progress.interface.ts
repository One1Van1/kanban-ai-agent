export interface CheckHaircutProgressResponse {
  tasksChecked: number;
  tasksMovedToReview: number;
  results: HaircutProgressResult[];
}

export interface HaircutProgressResult {
  taskKey: string;
  decision: 'move_to_review' | 'stay_in_progress';
  reason: string;
  moved: boolean;
  commentAdded?: string;
}
