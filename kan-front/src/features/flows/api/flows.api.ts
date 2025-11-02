/**
 * API клиент для блока Flows
 * Управление флоу (потоками): создание, редактирование, выполнение, экспорт/импорт
 */

import { httpClient } from '@/src/shared/api/http-client';

/**
 * Создать новый флоу
 */
export const createFlow = (data: {
  name: string;
  description?: string;
  definition: any;
  createdBy: string;
  metadata?: any;
}) => {
  return httpClient.post('/flow-management/create-flow', data);
};

/**
 * Получить флоу по ID
 */
export const getFlow = (flowId: string) => {
  return httpClient.get(`/flow-management/${flowId}`);
};

/**
 * Получить список всех флоу с фильтрацией
 */
export const listFlows = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  createdBy?: string;
  category?: string;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);

  const query = queryParams.toString();
  return httpClient.get(`/flow-management${query ? `?${query}` : ''}`);
};

/**
 * Обновить флоу
 */
export const updateFlow = (
  flowId: string,
  data: {
    name?: string;
    description?: string;
    definition?: any;
    status?: 'draft' | 'active' | 'archived';
    metadata?: any;
    updatedBy: string;
  },
) => {
  return httpClient.patch(`/flow-management/${flowId}`, data);
};

/**
 * Удалить флоу
 */
export const deleteFlow = (flowId: string) => {
  return httpClient.delete(`/flow-management/${flowId}`);
};

/**
 * Клонировать флоу
 */
export const cloneFlow = (
  flowId: string,
  data: {
    name: string;
    description?: string;
    clonedBy: string;
  },
) => {
  return httpClient.post(`/flow-management/${flowId}/clone`, data);
};

/**
 * Выполнить флоу
 */
export const executeFlow = (
  flowId: string,
  data: {
    context?: any;
    executedBy: string;
  },
) => {
  return httpClient.post(`/flow-management/${flowId}/execute`, data);
};

/**
 * Деплоить флоу в агента
 */
export const deployToAgent = (
  flowId: string,
  data: {
    userId: string;
    agentName?: string;
    agentDescription?: string;
  },
) => {
  return httpClient.post(`/flow-management/${flowId}/deploy-to-agent`, data);
};

/**
 * Экспортировать флоу в JSON
 */
export const exportFlowJson = async (flowId: string): Promise<any> => {
  const baseURL = httpClient.getBaseURL();
  const response = await fetch(
    `${baseURL}/flow-management/export-json/${flowId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to export flow: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Экспортировать флоу в PDF
 */
export const exportFlowPdf = async (flowId: string): Promise<Blob> => {
  const baseURL = httpClient.getBaseURL();
  const response = await fetch(
    `${baseURL}/flow-management/export-pdf/${flowId}`,
    {
      method: 'GET',
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to export flow to PDF: ${response.statusText}`);
  }
  return response.blob();
};

/**
 * Импортировать флоу из JSON
 */
export const importFlow = (data: {
  version: string;
  name: string;
  description?: string;
  status: string;
  definition: any;
  metadata?: any;
  importMode?: 'create_new' | 'replace_existing';
  flowIdToReplace?: string;
  createdBy?: string;
}) => {
  return httpClient.post('/flow-management/import', data);
};

/**
 * Объединённый API клиент для flows
 */
export const flowsAPI = {
  create: createFlow,
  get: getFlow,
  list: listFlows,
  update: updateFlow,
  delete: deleteFlow,
  clone: cloneFlow,
  execute: executeFlow,
  deployToAgent: deployToAgent,
  exportJson: exportFlowJson,
  exportPdf: exportFlowPdf,
  import: importFlow,
};
