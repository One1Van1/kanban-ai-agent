import axios from 'axios';

export class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  }

  // Generic HTTP methods
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  private get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  private post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  private patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data);
  }

  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // AI Agents API
  agents = {
    list: () => this.get('/ai-agent/get-agents'),
    getById: (id: string) => this.get(`/ai-agent/get-agent/${id}`),
    create: (data: any) => this.post('/ai-agent/create-agent', data),
    configure: (id: string, data: any) =>
      this.post(`/ai-agent/configure-agent`, { agentId: id, ...data }),
    execute: (data: any) => this.post('/ai-agent/execute-agent-action', data),
    getActivity: (agentId: string) =>
      this.get(`/ai-agent/get-agent-activity?agentId=${agentId}`),
  };

  // Kanban API
  kanban = {
    tasks: {
      getById: (id: string) => this.get(`/kanban/tasks/${id}`),
      getByColumn: (column: string) =>
        this.get(`/kanban/columns/${column}/tasks`),
      create: (data: any) => this.post('/kanban/tasks', data),
      update: (id: string, data: any) =>
        this.patch(`/kanban/tasks/${id}`, data),
      delete: (id: string) => this.delete(`/kanban/tasks/${id}`),
      assign: (id: string, data: any) =>
        this.post(`/kanban/tasks/${id}/assign`, data),
      move: (id: string, data: any) =>
        this.patch(`/kanban/tasks/${id}/move`, data),
      changeStatus: (id: string, data: any) =>
        this.patch(`/kanban/tasks/${id}/status`, data),
    },
    boards: {
      getStructure: (id: string) => this.get(`/kanban/boards/${id}/structure`),
      getStats: (id: string) => this.get(`/kanban/boards/${id}/stats`),
    },
    comments: {
      getByTask: (taskId: string) =>
        this.get(`/kanban/tasks/${taskId}/comments`),
      add: (taskId: string, data: any) =>
        this.post(`/kanban/tasks/${taskId}/comments`, data),
      update: (commentId: string, data: any) =>
        this.patch(`/kanban/comments/${commentId}`, data),
      delete: (commentId: string) =>
        this.delete(`/kanban/comments/${commentId}`),
    },
  };

  // Analytics API (future)
  analytics = {
    productivity: () => this.get('/analytics/productivity'),
    teamPerformance: (teamId: string) =>
      this.get(`/analytics/team/${teamId}/performance`),
  };
}

export const apiClient = new APIClient();
