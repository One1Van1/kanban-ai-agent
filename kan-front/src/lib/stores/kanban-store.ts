import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Task, Board, Comment, BoardColumn } from '../types';

interface KanbanStore {
  // State
  boards: Board[];
  currentBoard: Board | null;
  tasks: Task[];
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoards: () => Promise<void>;
  fetchBoard: (boardId: string) => Promise<void>;
  fetchTasksByColumn: (columnName: string) => Promise<void>;
  fetchTask: (taskId: string) => Promise<Task | null>;
  createTask: (data: any) => Promise<void>;
  updateTask: (taskId: string, data: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (
    taskId: string,
    targetColumnId: string,
    position?: number,
  ) => Promise<void>;
  assignTask: (taskId: string, assigneeEmail: string) => Promise<void>;

  // Comments
  fetchComments: (taskId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;

  // UI State
  setCurrentBoard: (board: Board | null) => void;
  clearError: () => void;
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  // Initial state
  boards: [],
  currentBoard: null,
  tasks: [],
  comments: [],
  isLoading: false,
  error: null,

  // Board actions
  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement boards API endpoint
      // const response = await apiClient.kanban.boards.list();
      // set({ boards: response.data || response, isLoading: false });
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch boards',
        isLoading: false,
      });
    }
  },

  fetchBoard: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = (await apiClient.kanban.boards.getStructure(
        boardId,
      )) as any;
      set({
        currentBoard: response.data || response,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch board',
        isLoading: false,
      });
    }
  },

  // Task actions
  fetchTasksByColumn: async (columnName) => {
    set({ isLoading: true, error: null });
    try {
      const response = (await apiClient.kanban.tasks.getByColumn(
        columnName,
      )) as any;
      const tasks = response.data || response;
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  fetchTask: async (taskId) => {
    try {
      const response = (await apiClient.kanban.tasks.getById(taskId)) as any;
      const task = response.data || response;

      // Update task in current tasks list
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
      }));

      return task;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch task' });
      return null;
    }
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = (await apiClient.kanban.tasks.create(data)) as any;
      const newTask = response.data || response;

      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    set({ error: null });
    try {
      const response = (await apiClient.kanban.tasks.update(
        taskId,
        data,
      )) as any;
      const updatedTask = response.data || response;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update task' });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ error: null });
    try {
      await apiClient.kanban.tasks.delete(taskId);

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete task' });
      throw error;
    }
  },

  moveTask: async (taskId, targetColumnId, position) => {
    set({ error: null });
    try {
      await apiClient.kanban.tasks.move(taskId, {
        targetColumnId,
        position,
      });

      // Optimistically update UI
      // In real implementation, you might want to fetch fresh data
    } catch (error: any) {
      set({ error: error.message || 'Failed to move task' });
      throw error;
    }
  },

  assignTask: async (taskId, assigneeEmail) => {
    set({ error: null });
    try {
      await apiClient.kanban.tasks.assign(taskId, { assigneeEmail });

      // Update task in store
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, assigneeEmail } : task,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to assign task' });
      throw error;
    }
  },

  // Comment actions
  fetchComments: async (taskId) => {
    try {
      const response = (await apiClient.kanban.comments.getByTask(
        taskId,
      )) as any;
      set({ comments: response.data || response });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch comments' });
    }
  },

  addComment: async (taskId, content) => {
    try {
      const response = (await apiClient.kanban.comments.add(taskId, {
        content,
      })) as any;
      const newComment = response.data || response;

      set((state) => ({
        comments: [...state.comments, newComment],
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add comment' });
      throw error;
    }
  },

  updateComment: async (commentId, content) => {
    try {
      await apiClient.kanban.comments.update(commentId, { content });

      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId ? { ...comment, content } : comment,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update comment' });
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      await apiClient.kanban.comments.delete(commentId);

      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete comment' });
      throw error;
    }
  },

  // UI State
  setCurrentBoard: (board) => {
    set({ currentBoard: board });
  },

  clearError: () => {
    set({ error: null });
  },
}));
