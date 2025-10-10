"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InstructionExecutorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionExecutorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const execute_agent_action_response_dto_1 = require("../execute-agent-action/execute-agent-action.response.dto");
const send_telegram_service_1 = require("../../notifications/send-telegram/send-telegram.service");
const send_email_service_1 = require("../../notifications/send-email/send-email.service");
const intelligent_agent_service_1 = require("../intelligent-agent/intelligent-agent.service");
const kanban_knowledge_base_service_1 = require("../kanban-knowledge-base/kanban-knowledge-base.service");
const agent_learning_service_1 = require("../agent-learning/agent-learning.service");
const agent_role_service_1 = require("../agent-role/agent-role.service");
let InstructionExecutorService = InstructionExecutorService_1 = class InstructionExecutorService {
    configService;
    sendTelegramService;
    sendEmailService;
    intelligentAgentService;
    knowledgeBaseService;
    learningService;
    roleService;
    logger = new common_1.Logger(InstructionExecutorService_1.name);
    constructor(configService, sendTelegramService, sendEmailService, intelligentAgentService, knowledgeBaseService, learningService, roleService) {
        this.configService = configService;
        this.sendTelegramService = sendTelegramService;
        this.sendEmailService = sendEmailService;
        this.intelligentAgentService = intelligentAgentService;
        this.knowledgeBaseService = knowledgeBaseService;
        this.learningService = learningService;
        this.roleService = roleService;
    }
    async executeInstruction(instruction, agent, request) {
        this.logger.log(`🤖 AI Agent analyzing instruction: "${instruction.instruction}"`);
        try {
            const aiAnalysis = await this.analyzeInstructionWithAI(instruction, request);
            this.logger.log(`🧠 AI Analysis completed: shouldExecute=${aiAnalysis.shouldExecute}, actions=${aiAnalysis.actions.length}`);
            if (!aiAnalysis.shouldExecute) {
                this.logger.log(`⏩ AI decided not to execute: ${aiAnalysis.reasoning}`);
                return [];
            }
            const executedActions = [];
            for (const action of aiAnalysis.actions) {
                try {
                    const executedAction = await this.executeAction(action, request);
                    if (executedAction) {
                        executedActions.push(executedAction);
                    }
                }
                catch (actionError) {
                    this.logger.error(`Failed to execute action ${action.type}:`, actionError);
                    executedActions.push(new execute_agent_action_response_dto_1.AgentActionOutputDto({
                        actionType: 'action_error',
                        description: `Failed to execute ${action.type}: ${actionError.message}`,
                        data: {
                            actionType: action.type,
                            error: actionError.message,
                            parameters: action.parameters,
                        },
                    }));
                }
            }
            return executedActions;
        }
        catch (error) {
            this.logger.error('AI instruction analysis failed:', error);
            return [
                new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
    async analyzeInstructionWithAI(instruction, request) {
        const claudeApiKey = this.configService.get('claude.apiKey');
        const claudeModel = this.configService.get('claude.model') ||
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
- Email исполнителя: ${request.taskData.assigneeEmail || 'Не указан'}
- Создатель: ${request.taskData.creator || 'Не указан'}
- Email создателя: ${request.taskData.creatorEmail || 'Не указан'}
- Колонка: ${request.columnName}
- Триггер: ${request.triggerType}
- Telegram поле: ${request.taskData.telegramField || 'Не указано'}

ПРИМЕРЫ ИНСТРУКЦИЙ НА БИЗНЕС-ЯЗЫКЕ И ИХ РЕАЛИЗАЦИЯ:
- "Отправь email исполнителю" → POST /notifications/email {"to": assigneeEmail, "subject": "...", "text": "..."}
- "Отправь email создателю задачи" → POST /notifications/email {"to": creatorEmail, "subject": "...", "text": "..."}
- "Отправь email с сообщением X" → POST /notifications/email {"to": assigneeEmail, "subject": "Уведомление", "text": "X"}
- "Уведоми создателя о начале работы" → POST /notifications/email {"to": creatorEmail, "subject": "Работа началась", "text": "Работа над задачей началась"}
- "Уведоми исполнителя о назначении" → POST /notifications/email {"to": assigneeEmail, "subject": "Назначена задача [key]", "text": "На вас назначена задача"}
- "Добавь комментарий X" → POST /rest/api/3/issue/{key}/comment с форматом ADF
- "Уведоми в Telegram" → POST /notifications/telegram с данными из telegramField

ДОСТУПНЫЕ API:
1. EMAIL API (ОСНОВНОЙ ДЛЯ EMAIL УВЕДОМЛЕНИЙ):
   - POST /notifications/email - отправить email
     Обязательные поля: {"to": "email@example.com", "subject": "Тема", "text": "Текст сообщения"}
     ВАЖНО: 
     * Для исполнителя используй assigneeEmail
     * Для создателя задачи используй creatorEmail
   
2. JIRA API - для работы с задачами:
   - POST /rest/api/3/issue/{issueKey}/comment - добавить комментарий
     Формат: {"body": {"type": "doc", "version": 1, "content": [{"type": "paragraph", "content": [{"type": "text", "text": "твой текст"}]}]}}
   - PUT /rest/api/3/issue/{issueKey} - обновить задачу
   - POST /rest/api/3/issue/{issueKey}/transitions - изменить статус
   
3. TELEGRAM API:
   - POST /notifications/telegram - отправить в Telegram
     Формат: {"chatId": "chatId", "message": "Текст сообщения"}
   - POST /bot{token}/sendMessage - прямой Telegram API

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
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: claudeModel,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 1000,
                temperature: 0.1,
            }, {
                headers: {
                    Authorization: `Bearer ${claudeApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Kanban AI Agent',
                },
                timeout: 30000,
            });
            const aiResponse = response.data.choices[0]?.message?.content;
            this.logger.log(`🤖 Raw AI response: ${aiResponse}`);
            const analysis = JSON.parse(aiResponse);
            if (typeof analysis.shouldExecute !== 'boolean') {
                throw new Error('Invalid AI response: shouldExecute must be boolean');
            }
            if (!Array.isArray(analysis.actions)) {
                throw new Error('Invalid AI response: actions must be array');
            }
            return analysis;
        }
        catch (error) {
            this.logger.error('Failed to analyze instruction with AI:', error);
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }
    async executeAction(action, request) {
        this.logger.log(`🎯 Executing action: ${action.type} - ${action.description}`);
        if (action.type === 'api_call') {
            return await this.executeApiCall(action, request);
        }
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
    async executeApiCall(action, request) {
        try {
            const { method, endpoint, payload, headers } = action;
            let baseUrl = '';
            let fullUrl = '';
            if (endpoint.startsWith('/rest/api/')) {
                baseUrl =
                    this.configService.get('jira.baseUrl') ||
                        'https://saakov2004.atlassian.net';
                fullUrl = `${baseUrl}${endpoint}`;
                const jiraAuth = {
                    Authorization: `Basic ${Buffer.from(`${this.configService.get('jira.email')}:${this.configService.get('jira.apiToken')}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                    ...headers,
                };
                const response = await axios_1.default.request({
                    method: method,
                    url: fullUrl,
                    data: payload,
                    headers: jiraAuth,
                    timeout: 30000,
                });
                return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
            }
            else if (endpoint.startsWith('/bot')) {
                const telegramToken = this.configService.get('telegram.botToken');
                fullUrl = `https://api.telegram.org${endpoint.replace('{token}', telegramToken)}`;
                const response = await axios_1.default.request({
                    method: method,
                    url: fullUrl,
                    data: payload,
                    headers: { 'Content-Type': 'application/json', ...headers },
                    timeout: 30000,
                });
                return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
            }
            else {
                baseUrl =
                    this.configService.get('app.baseUrl') ||
                        'http://localhost:3000';
                fullUrl = `${baseUrl}${endpoint}`;
                const response = await axios_1.default.request({
                    method: method,
                    url: fullUrl,
                    data: payload,
                    headers: { 'Content-Type': 'application/json', ...headers },
                    timeout: 30000,
                });
                return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
        }
        catch (error) {
            this.logger.error(`API call failed:`, error);
            return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
    async executeTelegramNotification(action, request) {
        const recipient = action.parameters?.recipient ||
            action.parameters?.chatId ||
            request.taskData.telegramField ||
            request.taskData.assignee;
        const message = action.parameters?.message ||
            `🔔 Уведомление о задаче ${request.taskData.key}: ${request.taskData.summary}`;
        try {
            const telegramResult = await this.sendTelegramService.execute({
                chatId: recipient,
                text: message,
                parseMode: 'HTML',
                disableWebPagePreview: true,
            });
            return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
        }
        catch (error) {
            return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
    executeValidationCheck(action, request) {
        const requiredFields = action.parameters?.requiredFields || [
            'title',
            'description',
            'assignee',
        ];
        const missingFields = requiredFields.filter((field) => !request.taskData[field]);
        return new execute_agent_action_response_dto_1.AgentActionOutputDto({
            actionType: 'validation_check',
            description: missingFields.length > 0
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
    async executeEmailNotification(action, request) {
        const recipient = action.parameters?.recipient || request.taskData.assignee;
        const subject = action.parameters?.subject ||
            action.parameters?.message ||
            'Уведомление о задаче';
        const message = action.parameters?.message ||
            `Уведомление о задаче ${request.taskData.key}`;
        try {
            const emailResult = await this.sendEmailService.execute({
                to: recipient,
                subject: subject,
                text: message,
                html: `<p>${message}</p>`,
            });
            return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
        }
        catch (error) {
            return new execute_agent_action_response_dto_1.AgentActionOutputDto({
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
    executeTaskUpdate(action, request) {
        return new execute_agent_action_response_dto_1.AgentActionOutputDto({
            actionType: 'task_update',
            description: `Task update prepared (not implemented): ${action.description}`,
            data: {
                taskId: request.taskId,
                updates: action.parameters || {},
                implemented: false,
            },
        });
    }
    executeCustomAction(action, request) {
        return new execute_agent_action_response_dto_1.AgentActionOutputDto({
            actionType: 'custom_action',
            description: `Custom action executed: ${action.description}`,
            data: {
                actionDescription: action.description,
                parameters: action.parameters,
                taskId: request.taskId,
            },
        });
    }
    async executeFallbackLogic(instruction, agent, request) {
        this.logger.log('🔄 Executing fallback logic...');
        try {
            const aiAnalysis = await this.analyzeInstructionWithAI(instruction, request);
            if (!aiAnalysis.shouldExecute) {
                return [];
            }
            const executedActions = [];
            for (const action of aiAnalysis.actions) {
                try {
                    const executedAction = await this.executeAction(action, request);
                    if (executedAction) {
                        executedActions.push(executedAction);
                    }
                }
                catch (actionError) {
                    executedActions.push(new execute_agent_action_response_dto_1.AgentActionOutputDto({
                        actionType: 'action_error',
                        description: `Fallback execution failed: ${actionError.message}`,
                        data: { error: actionError.message },
                    }));
                }
            }
            return executedActions;
        }
        catch (error) {
            return [
                new execute_agent_action_response_dto_1.AgentActionOutputDto({
                    actionType: 'fallback_error',
                    description: `Fallback execution failed: ${error.message}`,
                    data: { error: error.message },
                }),
            ];
        }
    }
    extractTaskType(request) {
        const summary = request.taskData.summary?.toLowerCase() || '';
        const description = request.taskData.description?.toLowerCase() || '';
        if (summary.includes('bug') || description.includes('bug')) {
            return 'bug';
        }
        if (summary.includes('feature') || description.includes('feature')) {
            return 'feature';
        }
        if (summary.includes('improvement') ||
            description.includes('improvement')) {
            return 'improvement';
        }
        if (summary.includes('epic') || description.includes('epic')) {
            return 'epic';
        }
        return 'task';
    }
    extractUrgency(request) {
        const priority = request.taskData.priority?.toLowerCase() || '';
        const summary = request.taskData.summary?.toLowerCase() || '';
        if (priority.includes('critical') ||
            priority.includes('blocker') ||
            summary.includes('urgent') ||
            summary.includes('critical')) {
            return 'critical';
        }
        if (priority.includes('high') || summary.includes('high')) {
            return 'high';
        }
        if (priority.includes('low') || summary.includes('low')) {
            return 'low';
        }
        return 'medium';
    }
    extractComplexity(request) {
        const description = request.taskData.description?.toLowerCase() || '';
        const summary = request.taskData.summary?.toLowerCase() || '';
        const complexKeywords = [
            'complex',
            'difficult',
            'challenging',
            'integration',
            'architecture',
        ];
        const simpleKeywords = ['simple', 'easy', 'quick', 'minor', 'small'];
        const text = `${description} ${summary}`;
        if (complexKeywords.some((keyword) => text.includes(keyword))) {
            return 'complex';
        }
        if (simpleKeywords.some((keyword) => text.includes(keyword))) {
            return 'simple';
        }
        return 'medium';
    }
    extractKeywords(instruction) {
        const keywords = [];
        const text = instruction.toLowerCase();
        const importantWords = [
            'bug',
            'feature',
            'urgent',
            'critical',
            'test',
            'review',
            'notification',
            'email',
            'telegram',
            'comment',
            'move',
            'assign',
            'priority',
            'blocked',
            'complete',
            'deploy',
        ];
        for (const word of importantWords) {
            if (text.includes(word)) {
                keywords.push(word);
            }
        }
        return keywords;
    }
    extractInstructionType(instruction) {
        const lowerInstruction = instruction.toLowerCase();
        if (lowerInstruction.includes('уведом') ||
            lowerInstruction.includes('notif')) {
            return 'notification';
        }
        if (lowerInstruction.includes('коммент') ||
            lowerInstruction.includes('comment')) {
            return 'comment';
        }
        if (lowerInstruction.includes('перенес') ||
            lowerInstruction.includes('move')) {
            return 'move_task';
        }
        if (lowerInstruction.includes('анализ') ||
            lowerInstruction.includes('analyz')) {
            return 'analysis';
        }
        if (lowerInstruction.includes('назнач') ||
            lowerInstruction.includes('assign')) {
            return 'assignment';
        }
        return 'general';
    }
    calculateImpactScore(results, role) {
        let score = 5;
        const successfulActions = results.filter((r) => !r.actionType.includes('error'));
        score += successfulActions.length * 2;
        if (role !== agent_role_service_1.AgentRole.UNIVERSAL) {
            score += 1;
        }
        const errorActions = results.filter((r) => r.actionType.includes('error'));
        score -= errorActions.length;
        return Math.max(1, Math.min(10, score));
    }
};
exports.InstructionExecutorService = InstructionExecutorService;
exports.InstructionExecutorService = InstructionExecutorService = InstructionExecutorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        send_telegram_service_1.SendTelegramService,
        send_email_service_1.SendEmailService,
        intelligent_agent_service_1.IntelligentAgentService,
        kanban_knowledge_base_service_1.KanbanKnowledgeBaseService,
        agent_learning_service_1.AgentLearningService,
        agent_role_service_1.AgentRoleService])
], InstructionExecutorService);
//# sourceMappingURL=instruction-executor.service.js.map