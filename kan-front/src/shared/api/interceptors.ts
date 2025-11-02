/**
 * Дополнительные interceptors для HTTP клиента
 * Здесь можно добавить логику авторизации, обработки ошибок и т.д.
 */

import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Добавить токен авторизации к запросу
 */
export const authInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  // Получить токен из localStorage/cookies
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Обработка ошибок авторизации
 */
export const authErrorInterceptor = (
  error: AxiosError,
): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    // Редирект на страницу логина или обновление токена
    console.warn('[Auth] Unauthorized access - redirecting to login');
    // window.location.href = '/login';
  }

  return Promise.reject(error);
};

/**
 * Логирование запросов (для дебага)
 */
export const loggingInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
  }
  return config;
};

/**
 * Применить все interceptors к Axios instance
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  // Request interceptors
  instance.interceptors.request.use(authInterceptor);
  instance.interceptors.request.use(loggingInterceptor);

  // Response interceptors
  instance.interceptors.response.use(undefined, authErrorInterceptor);
};
