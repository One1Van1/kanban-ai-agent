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
var IntelligentAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentAgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const execute_agent_action_response_dto_1 = require("../execute-agent-action/execute-agent-action.response.dto");
let IntelligentAgentService = IntelligentAgentService_1 = class IntelligentAgentService {
    configService;
    logger = new common_1.Logger(IntelligentAgentService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async executeIntelligentAction(instruction, agent, request) {
        this.logger.log(`🧠 Starting intelligent analysis for instruction: "${instruction.instruction}"`);
        try {
            const businessContext = await this.analyzeBusinessContext(request);
            this.logger.log(`📊 Business context: ${businessContext.taskType}, urgency: ${businessContext.urgency}`);
            const workflowAnalysis = await this.analyzeKanbanWorkflow(request, businessContext);
            this.logger.log(`📋 Workflow analysis: ${workflowAnalysis.suggestedNextSteps.length} suggestions`);
            const decision = await this.makeIntelligentDecision(instruction, businessContext, workflowAnalysis, request);
            this.logger.log(`🎯 Decision made: execute=${decision.shouldExecute}, confidence=${decision.confidence}%`);
            if (!decision.shouldExecute) {
                await this.recordDecisionForLearning(decision, false);
                return [];
            }
            const results = await this.executeIntelligentActions(decision.actions);
            await this.learnFromExecution(decision, results, true);
            return results;
        }
        catch (error) {
            this.logger.error('Intelligent agent execution failed:', error);
            throw error;
        }
    }
    async analyzeBusinessContext(request) {
        const claudeApiKey = this.configService.get('claude.apiKey');
        const claudeModel = this.configService.get('claude.model') ||
            'anthropic/claude-3-haiku-20240307';
        const prompt = `Проанализируй бизнес-контекст задачи и верни JSON:

ДАННЫЕ ЗАДАЧИ:
- Ключ: ${request.taskData.key}
- Название: ${request.taskData.summary || 'Не указано'}
- Описание: ${request.taskData.description || 'Не указано'}
- Исполнитель: ${request.taskData.assignee || 'Не назначен'}
- Колонка: ${request.columnName}
- Триггер: ${request.triggerType}

Определи:
1. Тип задачи (feature, bug, improvement, task, epic)
2. Уровень срочности (low, medium, high, critical)
3. Сложность (simple, medium, complex)
4. Заинтересованные стороны
5. Уровень риска (low, medium, high)
6. Влияние на бизнес (low, medium, high)

Верни СТРОГО JSON:
{
  "taskType": "feature|bug|improvement|task|epic",
  "urgency": "low|medium|high|critical",
  "complexity": "simple|medium|complex", 
  "stakeholders": ["assignee", "reporter", "team_lead"],
  "riskLevel": "low|medium|high",
  "businessImpact": "low|medium|high"
}`;
        try {
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: claudeModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0.1,
            }, {
                headers: {
                    Authorization: `Bearer ${claudeApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Kanban AI Agent',
                },
                timeout: 15000,
            });
            const aiResponse = response.data.choices[0]?.message?.content;
            return JSON.parse(aiResponse);
        }
        catch (error) {
            this.logger.error('Business context analysis failed:', error);
            return {
                taskType: 'task',
                urgency: 'medium',
                complexity: 'medium',
                stakeholders: ['assignee'],
                riskLevel: 'low',
                businessImpact: 'medium',
            };
        }
    }
    async analyzeKanbanWorkflow(request, businessContext) {
        const claudeApiKey = this.configService.get('claude.apiKey');
        const claudeModel = this.configService.get('claude.model') ||
            'anthropic/claude-3-haiku-20240307';
        const prompt = `Как эксперт по Kanban процессам, проанализируй workflow и верни JSON:

КОНТЕКСТ:
- Текущая колонка: ${request.columnName}
- Тип задачи: ${businessContext.taskType}
- Срочность: ${businessContext.urgency}
- Сложность: ${businessContext.complexity}
- Влияние на бизнес: ${businessContext.businessImpact}

ТИПИЧНЫЕ KANBAN КОЛОНКИ:
- Backlog, To Do, In Progress, In Review, Testing, Done

Проанализируй:
1. Следующие логичные шаги в workflow
2. Возможные блокеры
3. Предложения по оптимизации
4. Примерное время до завершения (в часах)

Верни СТРОГО JSON:
{
  "currentColumn": "${request.columnName}",
  "suggestedNextSteps": ["Шаг 1", "Шаг 2"],
  "workflowBlockers": ["Возможный блокер 1"],
  "optimizationSuggestions": ["Предложение 1"],
  "estimatedTimeToComplete": 24
}`;
        try {
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: claudeModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 600,
                temperature: 0.2,
            }, {
                headers: {
                    Authorization: `Bearer ${claudeApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Kanban AI Agent',
                },
                timeout: 15000,
            });
            const aiResponse = response.data.choices[0]?.message?.content;
            return JSON.parse(aiResponse);
        }
        catch (error) {
            this.logger.error('Workflow analysis failed:', error);
            return {
                currentColumn: request.columnName,
                suggestedNextSteps: ['Продолжить работу над задачей'],
                workflowBlockers: [],
                optimizationSuggestions: [],
                estimatedTimeToComplete: 24,
            };
        }
    }
    async makeIntelligentDecision(instruction, businessContext, workflowAnalysis, request) {
        const claudeApiKey = this.configService.get('claude.apiKey');
        const claudeModel = this.configService.get('claude.model') ||
            'anthropic/claude-3-sonnet-20240229';
        const prompt = `Ты - эксперт по Kanban и AI агент с опытом принятия решений.

ИНСТРУКЦИЯ АГЕНТА: "${instruction.instruction}"

БИЗНЕС-КОНТЕКСТ:
- Тип: ${businessContext.taskType}
- Срочность: ${businessContext.urgency}
- Сложность: ${businessContext.complexity}
- Риск: ${businessContext.riskLevel}
- Влияние: ${businessContext.businessImpact}

WORKFLOW АНАЛИЗ:
- Колонка: ${workflowAnalysis.currentColumn}
- Следующие шаги: ${workflowAnalysis.suggestedNextSteps.join(', ')}
- Блокеры: ${workflowAnalysis.workflowBlockers.join(', ')}

ДАННЫЕ ЗАДАЧИ:
- Задача: ${request.taskData.key}
- Название: ${request.taskData.summary || 'Не указано'}
- Исполнитель: ${request.taskData.assignee || 'Не назначен'}

ДОСТУПНЫЕ API:
1. JIRA API: /jira/tasks/{id}/comments, /jira/tasks/{id}/move, /jira/tasks/{id}
2. EMAIL API: /notifications/email
3. TELEGRAM API: /notifications/telegram

Принимай УМНОЕ решение на основе всего контекста!

Верни СТРОГО JSON:
{
  "shouldExecute": boolean,
  "confidence": number (0-100),
  "reasoning": "Подробное объяснение решения",
  "actions": [
    {
      "type": "api_call|notification|jira_action",
      "priority": number (1-5),
      "description": "Что делаем",
      "parameters": {
        "method": "POST|GET|PUT",
        "endpoint": "/api/endpoint",
        "payload": {}
      },
      "riskLevel": "low|medium|high",
      "expectedOutcome": "Ожидаемый результат"
    }
  ],
  "fallbackActions": [],
  "learningPoints": ["Что можно улучшить"]
}`;
        try {
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: claudeModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0.3,
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
            return JSON.parse(aiResponse);
        }
        catch (error) {
            this.logger.error('Intelligent decision making failed:', error);
            throw new Error(`Decision making failed: ${error.message}`);
        }
    }
    async executeIntelligentActions(actions) {
        const results = [];
        const sortedActions = actions.sort((a, b) => a.priority - b.priority);
        for (const action of sortedActions) {
            try {
                this.logger.log(`🎯 Executing action: ${action.description} (priority: ${action.priority})`);
                const result = await this.executeSpecificAction(action);
                results.push(result);
            }
            catch (error) {
                this.logger.error(`Action execution failed: ${action.description}`, error);
                results.push(new execute_agent_action_response_dto_1.AgentActionOutputDto({
                    actionType: 'action_error',
                    description: `Failed to execute ${action.description}: ${error.message}`,
                    data: {
                        actionType: action.type,
                        error: error.message,
                        parameters: action.parameters,
                    },
                }));
            }
        }
        return results;
    }
    async executeSpecificAction(action) {
        return new execute_agent_action_response_dto_1.AgentActionOutputDto({
            actionType: action.type,
            description: action.description,
            data: {
                priority: action.priority,
                riskLevel: action.riskLevel,
                expectedOutcome: action.expectedOutcome,
                parameters: action.parameters,
            },
        });
    }
    async learnFromExecution(decision, results, wasExecuted) {
        try {
            this.logger.log(`📚 Learning from execution: ${results.length} results, executed: ${wasExecuted}`);
            const successRate = results.filter((r) => !r.actionType.includes('error')).length /
                results.length;
            const learningData = {
                timestamp: new Date().toISOString(),
                decision: {
                    confidence: decision.confidence,
                    reasoning: decision.reasoning,
                    actionsCount: decision.actions.length,
                },
                execution: {
                    wasExecuted,
                    successRate,
                    resultsCount: results.length,
                },
                learningPoints: decision.learningPoints,
            };
            this.logger.log(`📊 Learning data: ${JSON.stringify(learningData, null, 2)}`);
        }
        catch (error) {
            this.logger.error('Learning from execution failed:', error);
        }
    }
    async recordDecisionForLearning(decision, wasExecuted) {
        try {
            const recordData = {
                timestamp: new Date().toISOString(),
                confidence: decision.confidence,
                reasoning: decision.reasoning,
                wasExecuted,
                learningPoints: decision.learningPoints,
            };
            this.logger.log(`📝 Decision recorded: ${JSON.stringify(recordData, null, 2)}`);
        }
        catch (error) {
            this.logger.error('Recording decision failed:', error);
        }
    }
};
exports.IntelligentAgentService = IntelligentAgentService;
exports.IntelligentAgentService = IntelligentAgentService = IntelligentAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntelligentAgentService);
//# sourceMappingURL=intelligent-agent.service.js.map