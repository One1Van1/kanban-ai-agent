/**
 * Базовый HTTP клиент для всех API запросов
 * Использует axios и содержит общую конфигурацию
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from './types';

class HttpClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 секунд
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Настройка interceptors (будет расширена в interceptors.ts)
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
        // Здесь можно добавить токены авторизации
        // const token = getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        console.error('[HTTP] Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.log(
          `[HTTP] Response from ${response.config.url}:`,
          response.data,
        );
        return response;
      },
      (error) => {
        console.error('[HTTP] Response error:', error);
        const apiError: ApiError = {
          message:
            error.response?.data?.message || error.message || 'Unknown error',
          statusCode: error.response?.status,
          errors: error.response?.data?.errors,
        };
        return Promise.reject(apiError);
      },
    );
  }

  /**
   * GET запрос
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  /**
   * POST запрос
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  /**
   * PUT запрос
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  /**
   * PATCH запрос
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(
      url,
      data,
      config,
    );
    return response.data;
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  /**
   * Получить Axios instance (для специфичных случаев)
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Получить baseURL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Экспортируем singleton instance
export const httpClient = new HttpClient();
