/**
 * Типы для блока Kanban
 */

/**
 * Задача на канбан доске
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  column: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

/**
 * Колонка на канбан доске
 */
export interface BoardColumn {
  id: string;
  name: string;
  title: string;
  taskIds: string[];
  color?: string;
  limit?: number;
}

/**
 * Канбан доска
 */
export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Комментарий к задаче
 */
export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Данные для создания задачи
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  column: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags?: string[];
}

/**
 * Данные для обновления задачи
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}

/**
 * Данные для перемещения задачи
 */
export interface MoveTaskData {
  column: string;
  position?: number;
}

/**
 * Статистика доски
 */
export interface BoardStats {
  totalTasks: number;
  tasksByColumn: Record<string, number>;
  tasksByPriority: Record<string, number>;
  completedTasks: number;
  overdueTasks: number;
}
