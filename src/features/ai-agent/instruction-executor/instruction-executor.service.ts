import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { Agent } from '../../../entities/agent.entity';
import { ExecuteAgentActionRequestDto } from '../execute-agent-action/execute-agent-action.request.dto';
import { AgentActionOutputDto } from '../execute-agent-action/execute-agent-action.response.dto';
import { SendTelegramService } from '../../notifications/send-telegram/send-telegram.service';
import { SendEmailService } from '../../notifications/send-email/send-email.service';

interface AIInstructionAnalysis {
  shouldExecute: boolean;
  actions: Array<{
    type:
      | 'telegram_notification'
      | 'email_notification'
      | 'task_update'
      | 'validation_check'
      | 'custom'
      | 'api_call'; // Новый универсальный тип
    description: string;
    parameters?: Record<string, any>;
    // Поля для API вызовов
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint?: string;
    payload?: Record<string, any>;
    headers?: Record<string, any>;
  }>;
  reasoning: string;
}

@Injectable()
export class InstructionExecutorService {
  private readonly logger = new Logger(InstructionExecutorService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sendTelegramService: SendTelegramService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  /**
   * 🧠 Универсальный AI-движок для выполнения инструкций агента
   */
  async executeInstruction(
    instruction: AgentInstruction,
    agent: Agent,
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto[]> {
    this.logger.log(
      `🤖 AI Agent analyzing instruction: "${instruction.instruction}"`,
    );

    try {
      // 1. Отправляем инструкцию к Claude AI для анализа
      const aiAnalysis = await this.analyzeInstructionWithAI(
        instruction,
        request,
      );

      this.logger.log(
        `🧠 AI Analysis completed: shouldExecute=${aiAnalysis.shouldExecute}, actions=${aiAnalysis.actions.length}`,
      );

      if (!aiAnalysis.shouldExecute) {
        this.logger.log(
          `⏩ AI decided not to execute: ${aiAnalysis.reasoning}`,
        );
        return [];
      }

      // 2. Выполняем действия, предложенные AI
      const executedActions: AgentActionOutputDto[] = [];

      for (const action of aiAnalysis.actions) {
        try {
          const executedAction = await this.executeAction(action, request);
          if (executedAction) {
            executedActions.push(executedAction);
          }
        } catch (actionError) {
          this.logger.error(
            `Failed to execute action ${action.type}:`,
            actionError,
          );

          // Добавляем action об ошибке
          executedActions.push(
            new AgentActionOutputDto({
              actionType: 'action_error',
              description: `Failed to execute ${action.type}: ${actionError.message}`,
              data: {
                actionType: action.type,
                error: actionError.message,
                parameters: action.parameters,
              },
            }),
          );
        }
      }

      return executedActions;
    } catch (error) {
      this.logger.error('AI instruction analysis failed:', error);

      // Fallback: возвращаем базовую ошибку
      return [
        new AgentActionOutputDto({
          actionType: 'ai_analysis_error',
          description: `AI analysis failed: ${error.message}`,
          data: {
            instruction: instruction.instruction,
            error: error.message,
          },
        }),
      ];
    }
  }

  /**
   * 🧠 Отправляем инструкцию Claude AI для анализа и получения действий
   */
  private async analyzeInstructionWithAI(
    instruction: AgentInstruction,
    request: ExecuteAgentActionRequestDto,
  ): Promise<AIInstructionAnalysis> {
    const claudeApiKey = this.configService.get<string>('claude.apiKey');
    const claudeModel =
      this.configService.get<string>('claude.model') ||
      'anthropic/claude-3-haiku-20240307';

    if (!claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    const prompt = `Ты - универсальный AI агент для управления задачами в Kanban системе. 
Ты можешь выполнять ЛЮБЫЕ API вызовы для решения поставленных задач.

ИНСТРУКЦИЯ АГЕНТА: "${instruction.instruction}"

КОНТЕКСТ ЗАДАЧИ:
- Задача: ${request.taskData.key}
- Название: ${request.taskData.summary || 'Не указано'}
- Исполнитель: ${request.taskData.assignee || 'Не назначен'}
- Колонка: ${request.columnName}
- Триггер: ${request.triggerType}
- Telegram поле: ${request.taskData.telegramField || 'Не указано'}

ДОСТУПНЫЕ API:
1. JIRA API - для работы с задачами:
   - POST /rest/api/3/issue/{issueKey}/comment - добавить комментарий
     Формат: {"body": {"type": "doc", "version": 1, "content": [{"type": "paragraph", "content": [{"type": "text", "text": "твой текст"}]}]}}
   - PUT /rest/api/3/issue/{issueKey} - обновить задачу
   - POST /rest/api/3/issue/{issueKey}/transitions - изменить статус
   
2. TELEGRAM API - для уведомлений:
   - POST /bot{token}/sendMessage - отправить сообщение
   
3. EMAIL API - для email уведомлений:
   - POST /send-email - отправить email
   
4. INTERNAL API - внутренние эндпойнты системы:
   - POST /jira/add-comment - добавить комментарий
   - POST /notifications/telegram - отправить в Telegram

Проанализируй инструкцию и верни КОНКРЕТНЫЕ API вызовы для выполнения.

Верни ответ СТРОГО в JSON формате:
{
  "shouldExecute": boolean,
  "actions": [
    {
      "type": "api_call",
      "description": "Что делаем",
      "method": "POST|GET|PUT|DELETE",
      "endpoint": "/api/endpoint",
      "payload": {
        "key": "value"
      },
      "headers": {
        "Content-Type": "application/json"
      }
    }
  ],
  "reasoning": "Почему принято такое решение"
}`;

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: claudeModel,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.1, // Низкая температура для точности
        },
        {
          headers: {
            Authorization: `Bearer ${claudeApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Kanban AI Agent',
          },
          timeout: 30000,
        },
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      this.logger.log(`🤖 Raw AI response: ${aiResponse}`);

      // Парсим JSON ответ от AI
      const analysis = JSON.parse(aiResponse) as AIInstructionAnalysis;

      // Валидируем структуру ответа
      if (typeof analysis.shouldExecute !== 'boolean') {
        throw new Error('Invalid AI response: shouldExecute must be boolean');
      }

      if (!Array.isArray(analysis.actions)) {
        throw new Error('Invalid AI response: actions must be array');
      }

      return analysis;
    } catch (error) {
      this.logger.error('Failed to analyze instruction with AI:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * 🚀 Выполняем конкретное действие
   */
  private async executeAction(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto | null> {
    this.logger.log(
      `🎯 Executing action: ${action.type} - ${action.description}`,
    );

    // Универсальный исполнитель API вызовов
    if (action.type === 'api_call') {
      return await this.executeApiCall(action, request);
    }

    // Поддержка старых типов для обратной совместимости
    switch (action.type) {
      case 'telegram_notification':
        return await this.executeTelegramNotification(action, request);

      case 'validation_check':
        return this.executeValidationCheck(action, request);

      case 'email_notification':
        return this.executeEmailNotification(action, request);

      case 'task_update':
        return this.executeTaskUpdate(action, request);

      case 'custom':
        return this.executeCustomAction(action, request);

      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
        return null;
    }
  }

  /**
   * 🌐 Универсальный исполнитель API вызовов
   */
  private async executeApiCall(
    action: any,
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto> {
    try {
      const { method, endpoint, payload, headers } = action;

      // Определяем базовый URL в зависимости от типа API
      let baseUrl = '';
      let fullUrl = '';

      if (endpoint.startsWith('/rest/api/')) {
        // Jira API
        baseUrl =
          this.configService.get<string>('jira.baseUrl') ||
          'https://saakov2004.atlassian.net';
        fullUrl = `${baseUrl}${endpoint}`;

        // Добавляем авторизацию для Jira
        const jiraAuth = {
          Authorization: `Basic ${Buffer.from(
            `${this.configService.get('jira.email')}:${this.configService.get('jira.apiToken')}`,
          ).toString('base64')}`,
          'Content-Type': 'application/json',
          ...headers,
        };

        const response = await axios.request({
          method: method as any,
          url: fullUrl,
          data: payload,
          headers: jiraAuth,
          timeout: 30000,
        });

        return new AgentActionOutputDto({
          actionType: 'api_call_jira',
          description: `Jira API call successful: ${action.description}`,
          data: {
            endpoint: fullUrl,
            method,
            payload,
            response: response.data,
            status: response.status,
          },
        });
      } else if (endpoint.startsWith('/bot')) {
        // Telegram API
        const telegramToken =
          this.configService.get<string>('telegram.botToken');
        fullUrl = `https://api.telegram.org${endpoint.replace('{token}', telegramToken)}`;

        const response = await axios.request({
          method: method as any,
          url: fullUrl,
          data: payload,
          headers: { 'Content-Type': 'application/json', ...headers },
          timeout: 30000,
        });

        return new AgentActionOutputDto({
          actionType: 'api_call_telegram',
          description: `Telegram API call successful: ${action.description}`,
          data: {
            endpoint: fullUrl,
            method,
            payload,
            response: response.data,
            status: response.status,
          },
        });
      } else {
        // Внутренние API системы
        baseUrl =
          this.configService.get<string>('app.baseUrl') ||
          'http://localhost:3000';
        fullUrl = `${baseUrl}${endpoint}`;

        const response = await axios.request({
          method: method as any,
          url: fullUrl,
          data: payload,
          headers: { 'Content-Type': 'application/json', ...headers },
          timeout: 30000,
        });

        return new AgentActionOutputDto({
          actionType: 'api_call_internal',
          description: `Internal API call successful: ${action.description}`,
          data: {
            endpoint: fullUrl,
            method,
            payload,
            response: response.data,
            status: response.status,
          },
        });
      }
    } catch (error) {
      this.logger.error(`API call failed:`, error);

      return new AgentActionOutputDto({
        actionType: 'api_call_error',
        description: `API call failed: ${action.description}`,
        data: {
          endpoint: action.endpoint,
          method: action.method,
          payload: action.payload,
          error: error.message,
          status: error.response?.status || 'unknown',
        },
      });
    }
  }

  /**
   * 📱 Выполняем Telegram уведомление
   */
  private async executeTelegramNotification(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto> {
    const recipient =
      action.parameters?.recipient ||
      action.parameters?.chatId ||
      request.taskData.telegramField ||
      request.taskData.assignee;

    const message =
      action.parameters?.message ||
      `🔔 Уведомление о задаче ${request.taskData.key}: ${request.taskData.summary}`;

    try {
      const telegramResult = await this.sendTelegramService.execute({
        chatId: recipient,
        text: message,
        parseMode: 'HTML',
        disableWebPagePreview: true,
      });

      return new AgentActionOutputDto({
        actionType: 'telegram_notification',
        description: `Telegram notification sent to ${recipient}: ${telegramResult.success ? 'SUCCESS' : 'FAILED'}`,
        data: {
          recipient,
          message,
          success: telegramResult.success,
          messageId: telegramResult.messageId,
          error: telegramResult.success ? null : telegramResult.message,
        },
      });
    } catch (error) {
      return new AgentActionOutputDto({
        actionType: 'telegram_notification_error',
        description: `Failed to send Telegram notification: ${error.message}`,
        data: {
          recipient,
          message,
          error: error.message,
        },
      });
    }
  }

  /**
   * ✅ Выполняем проверку валидности
   */
  private executeValidationCheck(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): AgentActionOutputDto {
    const requiredFields = action.parameters?.requiredFields || [
      'title',
      'description',
      'assignee',
    ];
    const missingFields = requiredFields.filter(
      (field: string) => !request.taskData[field],
    );

    return new AgentActionOutputDto({
      actionType: 'validation_check',
      description:
        missingFields.length > 0
          ? `Validation failed: missing ${missingFields.join(', ')}`
          : 'Validation passed: all required fields present',
      data: {
        requiredFields,
        missingFields,
        isValid: missingFields.length === 0,
        taskId: request.taskId,
      },
    });
  }

  /**
   * 📧 Выполняем email уведомление
   */
  private async executeEmailNotification(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto> {
    const recipient = action.parameters?.recipient || request.taskData.assignee;
    const subject =
      action.parameters?.subject ||
      action.parameters?.message ||
      'Уведомление о задаче';
    const message =
      action.parameters?.message ||
      `Уведомление о задаче ${request.taskData.key}`;

    try {
      const emailResult = await this.sendEmailService.execute({
        to: recipient,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      return new AgentActionOutputDto({
        actionType: 'email_notification',
        description: `Email notification sent to ${recipient}: ${emailResult.success ? 'SUCCESS' : 'FAILED'}`,
        data: {
          recipient,
          subject,
          message,
          success: emailResult.success,
          messageId: emailResult.messageId,
          error: emailResult.success ? null : emailResult.message,
        },
      });
    } catch (error) {
      return new AgentActionOutputDto({
        actionType: 'email_notification_error',
        description: `Failed to send email notification: ${error.message}`,
        data: {
          recipient,
          subject,
          message,
          error: error.message,
        },
      });
    }
  }

  /**
   * 📝 Выполняем обновление задачи (заглушка)
   */
  private executeTaskUpdate(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): AgentActionOutputDto {
    return new AgentActionOutputDto({
      actionType: 'task_update',
      description: `Task update prepared (not implemented): ${action.description}`,
      data: {
        taskId: request.taskId,
        updates: action.parameters || {},
        implemented: false,
      },
    });
  }

  /**
   * 🎭 Выполняем кастомное действие
   */
  private executeCustomAction(
    action: AIInstructionAnalysis['actions'][0],
    request: ExecuteAgentActionRequestDto,
  ): AgentActionOutputDto {
    return new AgentActionOutputDto({
      actionType: 'custom_action',
      description: `Custom action executed: ${action.description}`,
      data: {
        actionDescription: action.description,
        parameters: action.parameters,
        taskId: request.taskId,
      },
    });
  }
}
