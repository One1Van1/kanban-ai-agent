import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { Agent } from '../../../entities/agent.entity';
import { ExecuteAgentActionRequestDto } from '../execute-agent-action/execute-agent-action.request.dto';
import { AgentActionOutputDto } from '../execute-agent-action/execute-agent-action.response.dto';

interface BusinessContext {
  taskType: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'medium' | 'complex';
  stakeholders: string[];
  riskLevel: 'low' | 'medium' | 'high';
  businessImpact: 'low' | 'medium' | 'high';
}

interface KanbanWorkflowAnalysis {
  currentColumn: string;
  suggestedNextSteps: string[];
  workflowBlockers: string[];
  optimizationSuggestions: string[];
  estimatedTimeToComplete: number;
}

interface IntelligentDecision {
  shouldExecute: boolean;
  confidence: number; // 0-100%
  reasoning: string;
  actions: Array<{
    type: string;
    priority: number;
    description: string;
    parameters: any;
    riskLevel: 'low' | 'medium' | 'high';
    expectedOutcome: string;
  }>;
  fallbackActions: Array<any>;
  learningPoints: string[];
}

@Injectable()
export class IntelligentAgentService {
  private readonly logger = new Logger(IntelligentAgentService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * 🧠 Главный метод: интеллектуальный анализ и выполнение
   */
  async executeIntelligentAction(
    instruction: AgentInstruction,
    agent: Agent,
    request: ExecuteAgentActionRequestDto,
  ): Promise<AgentActionOutputDto[]> {
    this.logger.log(
      `🧠 Starting intelligent analysis for instruction: "${instruction.instruction}"`,
    );

    try {
      // Уровень 1: Анализ бизнес-контекста
      const businessContext = await this.analyzeBusinessContext(request);
      this.logger.log(
        `📊 Business context: ${businessContext.taskType}, urgency: ${businessContext.urgency}`,
      );

      // Уровень 2: Анализ канбан-процессов
      const workflowAnalysis = await this.analyzeKanbanWorkflow(
        request,
        businessContext,
      );
      this.logger.log(
        `📋 Workflow analysis: ${workflowAnalysis.suggestedNextSteps.length} suggestions`,
      );

      // Уровень 3: Принятие умного решения
      const decision = await this.makeIntelligentDecision(
        instruction,
        businessContext,
        workflowAnalysis,
        request,
      );
      this.logger.log(
        `🎯 Decision made: execute=${decision.shouldExecute}, confidence=${decision.confidence}%`,
      );

      if (!decision.shouldExecute) {
        // Сохраняем решение для обучения
        await this.recordDecisionForLearning(decision, false);
        return [];
      }

      // Выполняем действия с приоритизацией
      const results = await this.executeIntelligentActions(decision.actions);

      // Уровень 4: Обучение на результатах
      await this.learnFromExecution(decision, results, true);

      return results;
    } catch (error) {
      this.logger.error('Intelligent agent execution failed:', error);
      throw error;
    }
  }

  /**
   * 📊 Уровень 1: Анализ бизнес-контекста
   */
  private async analyzeBusinessContext(
    request: ExecuteAgentActionRequestDto,
  ): Promise<BusinessContext> {
    const claudeApiKey = this.configService.get<string>('claude.apiKey');
    const claudeModel =
      this.configService.get<string>('claude.model') ||
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
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: claudeModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${claudeApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Kanban AI Agent',
          },
          timeout: 15000,
        },
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      return JSON.parse(aiResponse) as BusinessContext;
    } catch (error) {
      this.logger.error('Business context analysis failed:', error);
      // Fallback к базовому анализу
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

  /**
   * 📋 Уровень 2: Анализ канбан-процессов
   */
  private async analyzeKanbanWorkflow(
    request: ExecuteAgentActionRequestDto,
    businessContext: BusinessContext,
  ): Promise<KanbanWorkflowAnalysis> {
    const claudeApiKey = this.configService.get<string>('claude.apiKey');
    const claudeModel =
      this.configService.get<string>('claude.model') ||
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
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: claudeModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${claudeApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Kanban AI Agent',
          },
          timeout: 15000,
        },
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      return JSON.parse(aiResponse) as KanbanWorkflowAnalysis;
    } catch (error) {
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

  /**
   * 🎯 Уровень 3: Принятие интеллектуального решения
   */
  private async makeIntelligentDecision(
    instruction: AgentInstruction,
    businessContext: BusinessContext,
    workflowAnalysis: KanbanWorkflowAnalysis,
    request: ExecuteAgentActionRequestDto,
  ): Promise<IntelligentDecision> {
    const claudeApiKey = this.configService.get<string>('claude.apiKey');
    const claudeModel =
      this.configService.get<string>('claude.model') ||
      'anthropic/claude-3-sonnet-20240229'; // Используем более мощную модель для решений

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
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: claudeModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.3,
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
      return JSON.parse(aiResponse) as IntelligentDecision;
    } catch (error) {
      this.logger.error('Intelligent decision making failed:', error);
      throw new Error(`Decision making failed: ${error.message}`);
    }
  }

  /**
   * 🚀 Выполнение приоритизированных действий
   */
  private async executeIntelligentActions(
    actions: IntelligentDecision['actions'],
  ): Promise<AgentActionOutputDto[]> {
    const results: AgentActionOutputDto[] = [];

    // Сортируем по приоритету
    const sortedActions = actions.sort((a, b) => a.priority - b.priority);

    for (const action of sortedActions) {
      try {
        this.logger.log(
          `🎯 Executing action: ${action.description} (priority: ${action.priority})`,
        );

        // Здесь будет логика выполнения конкретных действий
        // В зависимости от типа действия
        const result = await this.executeSpecificAction(action);
        results.push(result);
      } catch (error) {
        this.logger.error(
          `Action execution failed: ${action.description}`,
          error,
        );

        results.push(
          new AgentActionOutputDto({
            actionType: 'action_error',
            description: `Failed to execute ${action.description}: ${error.message}`,
            data: {
              actionType: action.type,
              error: error.message,
              parameters: action.parameters,
            },
          }),
        );
      }
    }

    return results;
  }

  /**
   * 🎯 Выполнение конкретного действия
   */
  private async executeSpecificAction(
    action: IntelligentDecision['actions'][0],
  ): Promise<AgentActionOutputDto> {
    // Пока заглушка - здесь будет реальная логика выполнения
    return new AgentActionOutputDto({
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

  /**
   * 📚 Уровень 4: Обучение на результатах
   */
  private async learnFromExecution(
    decision: IntelligentDecision,
    results: AgentActionOutputDto[],
    wasExecuted: boolean,
  ): Promise<void> {
    try {
      this.logger.log(
        `📚 Learning from execution: ${results.length} results, executed: ${wasExecuted}`,
      );

      // Анализируем успешность выполнения
      const successRate =
        results.filter((r) => !r.actionType.includes('error')).length /
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

      // Сохраняем данные для обучения (пока в логах, потом в БД)
      this.logger.log(
        `📊 Learning data: ${JSON.stringify(learningData, null, 2)}`,
      );

      // TODO: Сохранить в базу данных для дальнейшего анализа паттернов
    } catch (error) {
      this.logger.error('Learning from execution failed:', error);
    }
  }

  /**
   * 📝 Сохранение решения для обучения
   */
  private async recordDecisionForLearning(
    decision: IntelligentDecision,
    wasExecuted: boolean,
  ): Promise<void> {
    try {
      const recordData = {
        timestamp: new Date().toISOString(),
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        wasExecuted,
        learningPoints: decision.learningPoints,
      };

      this.logger.log(
        `📝 Decision recorded: ${JSON.stringify(recordData, null, 2)}`,
      );

      // TODO: Сохранить в базу данных
    } catch (error) {
      this.logger.error('Recording decision failed:', error);
    }
  }
}
