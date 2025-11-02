/**
 * API клиент для блока Kanban
 * Управление задачами, досками и комментариями канбана
 */

import { httpClient } from '@/src/shared/api/http-client';

/**
 * API методы для работы с задачами канбана
 */
export const kanbanTasksAPI = {
  /**
   * Получить задачу по ID
   */
  getById: (id: string) => {
    return httpClient.get(`/kanban/tasks/${id}`);
  },

  /**
   * Получить все задачи в колонке
   */
  getByColumn: (column: string) => {
    return httpClient.get(`/kanban/columns/${column}/tasks`);
  },

  /**
   * Создать новую задачу
   */
  create: (data: {
    title: string;
    description?: string;
    column: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
    dueDate?: string;
  }) => {
    return httpClient.post('/kanban/tasks', data);
  },

  /**
   * Обновить задачу
   */
  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      assignee: string;
      dueDate: string;
    }>,
  ) => {
    return httpClient.patch(`/kanban/tasks/${id}`, data);
  },

  /**
   * Удалить задачу
   */
  delete: (id: string) => {
    return httpClient.delete(`/kanban/tasks/${id}`);
  },

  /**
   * Назначить задачу пользователю
   */
  assign: (id: string, data: { assignee: string }) => {
    return httpClient.post(`/kanban/tasks/${id}/assign`, data);
  },

  /**
   * Переместить задачу в другую колонку
   */
  move: (id: string, data: { column: string; position?: number }) => {
    return httpClient.patch(`/kanban/tasks/${id}/move`, data);
  },

  /**
   * Изменить статус задачи
   */
  changeStatus: (id: string, data: { status: string }) => {
    return httpClient.patch(`/kanban/tasks/${id}/status`, data);
  },
};

/**
 * API методы для работы с досками канбана
 */
export const kanbanBoardsAPI = {
  /**
   * Получить структуру доски
   */
  getStructure: (id: string) => {
    return httpClient.get(`/kanban/boards/${id}/structure`);
  },

  /**
   * Получить статистику доски
   */
  getStats: (id: string) => {
    return httpClient.get(`/kanban/boards/${id}/stats`);
  },
};

/**
 * API методы для работы с комментариями
 */
export const kanbanCommentsAPI = {
  /**
   * Получить все комментарии к задаче
   */
  getByTask: (taskId: string) => {
    return httpClient.get(`/kanban/tasks/${taskId}/comments`);
  },

  /**
   * Добавить комментарий к задаче
   */
  add: (taskId: string, data: { text: string; author: string }) => {
    return httpClient.post(`/kanban/tasks/${taskId}/comments`, data);
  },

  /**
   * Обновить комментарий
   */
  update: (commentId: string, data: { text: string }) => {
    return httpClient.patch(`/kanban/comments/${commentId}`, data);
  },

  /**
   * Удалить комментарий
   */
  delete: (commentId: string) => {
    return httpClient.delete(`/kanban/comments/${commentId}`);
  },
};

/**
 * Объединённый API клиент для канбана
 */
export const kanbanAPI = {
  tasks: kanbanTasksAPI,
  boards: kanbanBoardsAPI,
  comments: kanbanCommentsAPI,
};
