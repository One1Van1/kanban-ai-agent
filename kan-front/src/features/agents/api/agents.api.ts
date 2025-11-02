/**
 * API клиент для блока Agents
 * Управление AI агентами, их конфигурацией и выполнением действий
 */

import { httpClient } from '@/src/shared/api/http-client';

/**
 * Получить всех агентов
 */
export const getAllAgents = () => {
  return httpClient.get('/agents');
};

/**
 * Получить агента по ID
 */
export const getAgentById = (id: string) => {
  return httpClient.get(`/ai-agent/${id}`);
};

/**
 * Создать нового агента
 */
export const createAgent = (data: {
  name: string;
  description?: string;
  type?: string;
  configuration?: any;
}) => {
  return httpClient.post('/ai-agent', data);
};

/**
 * Обновить конфигурацию агента
 */
export const configureAgent = (
  id: string,
  data: {
    configuration: any;
    settings?: any;
  },
) => {
  return httpClient.put(`/ai-agent/${id}/configure`, data);
};

/**
 * Выполнить действие через агента
 */
export const executeAgentAction = (data: {
  agentId: string;
  action: string;
  parameters?: any;
  context?: any;
}) => {
  return httpClient.post('/ai-agent/execute-action', data);
};

/**
 * Получить активность агента (логи, история действий)
 */
export const getAgentActivity = (agentId: string) => {
  return httpClient.get(`/ai-agent/${agentId}/activity`);
};

/**
 * Удалить агента
 */
export const deleteAgent = (id: string) => {
  return httpClient.delete(`/ai-agent/${id}`);
};

/**
 * Обновить базовые данные агента (имя, описание)
 */
export const updateAgent = (
  id: string,
  data: {
    name?: string;
    description?: string;
    isActive?: boolean;
  },
) => {
  return httpClient.patch(`/ai-agent/${id}`, data);
};

/**
 * Объединённый API клиент для агентов
 */
export const agentsAPI = {
  getAll: getAllAgents,
  getById: getAgentById,
  create: createAgent,
  configure: configureAgent,
  execute: executeAgentAction,
  getActivity: getAgentActivity,
  delete: deleteAgent,
  update: updateAgent,
};
