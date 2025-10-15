import axios from 'axios';
import {
  GetAllAgentsResponse,
  FlowBuilderSaveResponse,
  FlowManagementResponse,
  ListFlowsResponse,
  FlowExecutionResponse,
  FlowCloneResponse,
} from '../types';

export class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    console.log('API Client initialized with baseURL:', this.baseURL);
  }

  // Generic HTTP methods
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
  ): Promise<T> {
    const fullURL = `${this.baseURL}${endpoint}`;
    console.log(`Making ${method} request to:`, fullURL);
    console.log('Request data:', data);

    try {
      const response = await axios({
        method,
        url: fullURL,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 секунд таймаут
      });
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error (${method} ${fullURL}):`, error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        throw new Error(message);
      }
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

  private put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // AI Agents API
  agents = {
    getAll: (): Promise<GetAllAgentsResponse> => this.get('/agents'),
    getById: (id: string) => this.get(`/ai-agent/${id}`),
    create: (data: any) => this.post('/ai-agent', data),
    configure: (id: string, data: any) =>
      this.put(`/ai-agent/${id}/configure`, data),
    execute: (data: any) => this.post('/ai-agent/execute-action', data),
    getActivity: (agentId: string) => this.get(`/ai-agent/${agentId}/activity`),
  };

  // Flow Management API
  flowManagement = {
    // Create flow
    createFlow: (data: {
      name: string;
      description?: string;
      definition: any;
      createdBy: string;
      metadata?: any;
    }): Promise<FlowManagementResponse> =>
      this.post('/flow-management/create-flow', data),

    // Get flow by ID
    getFlow: (flowId: string): Promise<FlowManagementResponse> =>
      this.get(`/flow-management/${flowId}`),

    // List flows with pagination and filters
    listFlows: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      createdBy?: string;
      category?: string;
      search?: string;
    }): Promise<ListFlowsResponse> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const query = queryParams.toString();
      return this.get(`/flow-management${query ? `?${query}` : ''}`);
    },

    // Update flow
    updateFlow: (
      flowId: string,
      data: {
        name?: string;
        description?: string;
        definition?: any;
        status?: 'draft' | 'active' | 'archived';
        metadata?: any;
        updatedBy: string;
      },
    ): Promise<FlowManagementResponse> =>
      this.patch(`/flow-management/${flowId}`, data),

    // Delete flow
    deleteFlow: (flowId: string): Promise<{ message: string }> =>
      this.delete(`/flow-management/${flowId}`),

    // Clone flow
    cloneFlow: (
      flowId: string,
      data: {
        name: string;
        description?: string;
        clonedBy: string;
      },
    ): Promise<FlowCloneResponse> =>
      this.post(`/flow-management/${flowId}/clone`, data),

    // Execute flow
    executeFlow: (
      flowId: string,
      data: {
        context?: any;
        executedBy: string;
      },
    ): Promise<FlowExecutionResponse> =>
      this.post(`/flow-management/${flowId}/execute`, data),
  };

  // Legacy Flow Builder API (deprecated - use flowManagement instead)
  flowBuilder = {
    saveFlow: (flowDefinition: any): Promise<FlowBuilderSaveResponse> =>
      this.post('/ai-agent/flow-builder/save-flow', { flowDefinition }),
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
