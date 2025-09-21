import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JiraTask } from '../jira/types/jira-task.interface';
import { KanbanTaskSummary } from '../jira/types/kanban-column.interface';

export interface TaskAnalysisResult {
  taskKey: string;
  summary: string;
  analysisType:
    | 'code'
    | 'documentation'
    | 'testing'
    | 'research'
    | 'configuration'
    | 'unknown';
  complexity: 'low' | 'medium' | 'high';
  estimatedTime: number; // в минутах
  requiredActions: string[];
  canAutoExecute: boolean;
  reasoning: string;
  dependencies?: string[];
  risks?: string[];
}

export interface ExecutionPlan {
  taskKey: string;
  steps: ExecutionStep[];
  totalEstimatedTime: number;
  requiresHumanApproval: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ExecutionStep {
  id: string;
  description: string;
  type:
    | 'file_creation'
    | 'file_modification'
    | 'command_execution'
    | 'api_call'
    | 'manual_review';
  estimatedTime: number;
  dependencies?: string[];
  command?: string;
  filePath?: string;
  content?: string;
}

@Injectable()
export class AIAnalysisService {
  private readonly logger = new Logger(AIAnalysisService.name);
  private readonly claudeApiKey: string;
  private readonly claudeModel: string;

  constructor(private readonly configService: ConfigService) {
    this.claudeApiKey = this.configService.get<string>('claude.apiKey') || '';
    this.claudeModel =
      this.configService.get<string>('claude.model') ||
      'claude-3-sonnet-20240229';
  }

  /**
   * Анализировать задачу и определить план выполнения
   */
  async analyzeTask(
    task: JiraTask | KanbanTaskSummary,
  ): Promise<TaskAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(task);
      const response = await this.callClaudeAPI(prompt);

      const analysis = this.parseAnalysisResponse(response, task.key);

      this.logger.log(
        `Analyzed task ${task.key}: ${analysis.analysisType} (${analysis.complexity})`,
      );

      return analysis;
    } catch (error) {
      this.logger.error(`Failed to analyze task ${task.key}:`, error.message);

      // Fallback анализ без AI
      return this.createFallbackAnalysis(task);
    }
  }

  /**
   * Создать детальный план выполнения задачи
   */
  async createExecutionPlan(
    task: JiraTask | KanbanTaskSummary,
  ): Promise<ExecutionPlan> {
    try {
      const analysis = await this.analyzeTask(task);

      if (!analysis.canAutoExecute) {
        return {
          taskKey: task.key,
          steps: [
            {
              id: 'manual-review',
              description:
                'Требует ручного выполнения или дополнительной информации',
              type: 'manual_review',
              estimatedTime: analysis.estimatedTime,
            },
          ],
          totalEstimatedTime: analysis.estimatedTime,
          requiresHumanApproval: true,
          riskLevel: 'high',
        };
      }

      const prompt = this.buildExecutionPlanPrompt(task, analysis);
      const response = await this.callClaudeAPI(prompt);

      const plan = this.parseExecutionPlanResponse(response, task.key);

      this.logger.log(
        `Created execution plan for ${task.key}: ${plan.steps.length} steps`,
      );

      return plan;
    } catch (error) {
      this.logger.error(
        `Failed to create execution plan for ${task.key}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Определить приоритет задачи на основе анализа
   */
  async analyzePriority(
    tasks: KanbanTaskSummary[],
  ): Promise<KanbanTaskSummary[]> {
    if (tasks.length === 0) return tasks;

    try {
      const prompt = this.buildPriorityAnalysisPrompt(tasks);
      const response = await this.callClaudeAPI(prompt);

      const priorities = this.parsePriorityResponse(response);

      // Сортируем задачи по AI-приоритету
      return tasks.sort((a, b) => {
        const aPriority = priorities[a.key] || 50;
        const bPriority = priorities[b.key] || 50;
        return bPriority - aPriority; // Высокий приоритет первым
      });
    } catch (error) {
      this.logger.error('Failed to analyze task priorities:', error.message);
      return tasks; // Возвращаем исходный порядок
    }
  }

  /**
   * Проверить готовность задачи к выполнению
   */
  async checkTaskReadiness(task: JiraTask): Promise<{
    isReady: boolean;
    missingInfo: string[];
    recommendations: string[];
  }> {
    const description = task.fields.description || '';
    const summary = task.fields.summary;

    const missingInfo: string[] = [];
    const recommendations: string[] = [];

    // Базовые проверки
    if (!description.trim()) {
      missingInfo.push('Отсутствует описание задачи');
      recommendations.push(
        'Добавьте детальное описание того, что нужно сделать',
      );
    }

    if (summary.length < 10) {
      missingInfo.push('Слишком краткое название');
      recommendations.push('Уточните название задачи');
    }

    if (!task.fields.assignee) {
      recommendations.push('Рассмотрите назначение исполнителя');
    }

    // AI анализ для более сложных проверок
    if (this.claudeApiKey) {
      try {
        const prompt = `
Проанализируй готовность задачи к выполнению:
Название: ${summary}
Описание: ${description}

Определи:
1. Достаточно ли информации для выполнения?
2. Какая информация отсутствует?
3. Какие есть рекомендации?

Ответь в формате JSON:
{
  "hasEnoughInfo": boolean,
  "missingInfo": ["пункт1", "пункт2"],
  "recommendations": ["рекомендация1", "рекомендация2"]
}`;

        const response = await this.callClaudeAPI(prompt);
        const aiAnalysis = JSON.parse(response);

        if (!aiAnalysis.hasEnoughInfo) {
          missingInfo.push(...aiAnalysis.missingInfo);
        }
        recommendations.push(...aiAnalysis.recommendations);
      } catch (error) {
        this.logger.warn(
          `AI readiness check failed for ${task.key}:`,
          error.message,
        );
      }
    }

    return {
      isReady: missingInfo.length === 0,
      missingInfo,
      recommendations,
    };
  }

  // Приватные методы

  private buildAnalysisPrompt(task: JiraTask | KanbanTaskSummary): string {
    const summary = 'summary' in task ? task.summary : task.fields.summary;
    const description = 'fields' in task ? task.fields.description : '';

    return `
Проанализируй задачу из Jira и определи план действий:

Название: ${summary}
Описание: ${description || 'Описание отсутствует'}
Тип: ${'issueType' in task ? task.issueType.name : 'Unknown'}

Определи:
1. Тип задачи (code/documentation/testing/research/configuration/unknown)
2. Сложность (low/medium/high)
3. Примерное время выполнения в минутах
4. Можно ли выполнить автоматически
5. Основные действия для выполнения
6. Потенциальные риски

Ответь в формате JSON:
{
  "analysisType": "тип",
  "complexity": "сложность", 
  "estimatedTime": число_минут,
  "canAutoExecute": boolean,
  "requiredActions": ["действие1", "действие2"],
  "reasoning": "объяснение решения",
  "dependencies": ["зависимость1"],
  "risks": ["риск1", "риск2"]
}`;
  }

  private buildExecutionPlanPrompt(
    task: JiraTask | KanbanTaskSummary,
    analysis: TaskAnalysisResult,
  ): string {
    const summary = 'summary' in task ? task.summary : task.fields.summary;

    return `
Создай детальный план выполнения задачи:

Задача: ${summary}
Тип: ${analysis.analysisType}
Сложность: ${analysis.complexity}
Действия: ${analysis.requiredActions.join(', ')}

Создай пошаговый план выполнения. Каждый шаг должен содержать:
- Описание действия
- Тип (file_creation/file_modification/command_execution/api_call/manual_review)
- Время выполнения в минутах
- Команду или путь к файлу (если применимо)

Ответь в формате JSON:
{
  "steps": [
    {
      "id": "step1",
      "description": "описание",
      "type": "тип",
      "estimatedTime": минуты,
      "command": "команда (если нужна)",
      "filePath": "путь (если нужен)"
    }
  ],
  "requiresHumanApproval": boolean,
  "riskLevel": "low/medium/high"
}`;
  }

  private buildPriorityAnalysisPrompt(tasks: KanbanTaskSummary[]): string {
    const taskList = tasks.map((t) => `${t.key}: ${t.summary}`).join('\n');

    return `
Проанализируй приоритет задач для автоматического выполнения:

Задачи:
${taskList}

Для каждой задачи определи приоритет от 0 до 100, где:
- 90-100: Критические задачи, требующие немедленного внимания
- 70-89: Важные задачи
- 50-69: Обычные задачи
- 30-49: Задачи с низким приоритетом
- 0-29: Задачи, которые можно отложить

Ответь в формате JSON:
{
  "KAN-1": 85,
  "KAN-2": 60
}`;
  }

  private async callClaudeAPI(prompt: string): Promise<string> {
    if (!this.claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    // Здесь будет реальный вызов Claude API
    // Пока возвращаем заглушку
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.logger.debug('Claude API call simulated');

    // Имитируем ответ Claude
    return '{"analysisType": "code", "complexity": "medium", "estimatedTime": 30, "canAutoExecute": true, "requiredActions": ["create file", "write code"], "reasoning": "Simple task", "dependencies": [], "risks": []}';
  }

  private parseAnalysisResponse(
    response: string,
    taskKey: string,
  ): TaskAnalysisResult {
    try {
      const parsed = JSON.parse(response);

      return {
        taskKey,
        summary: taskKey,
        analysisType: parsed.analysisType || 'unknown',
        complexity: parsed.complexity || 'medium',
        estimatedTime: parsed.estimatedTime || 30,
        requiredActions: parsed.requiredActions || [],
        canAutoExecute: parsed.canAutoExecute || false,
        reasoning: parsed.reasoning || 'No reasoning provided',
        dependencies: parsed.dependencies || [],
        risks: parsed.risks || [],
      };
    } catch (error) {
      this.logger.error(`Failed to parse analysis response: ${error.message}`);
      throw error;
    }
  }

  private parseExecutionPlanResponse(
    response: string,
    taskKey: string,
  ): ExecutionPlan {
    try {
      const parsed = JSON.parse(response);

      const steps: ExecutionStep[] =
        parsed.steps?.map((step: any, index: number) => ({
          id: step.id || `step-${index + 1}`,
          description: step.description || 'No description',
          type: step.type || 'manual_review',
          estimatedTime: step.estimatedTime || 10,
          command: step.command,
          filePath: step.filePath,
          content: step.content,
        })) || [];

      return {
        taskKey,
        steps,
        totalEstimatedTime: steps.reduce(
          (sum, step) => sum + step.estimatedTime,
          0,
        ),
        requiresHumanApproval: parsed.requiresHumanApproval || true,
        riskLevel: parsed.riskLevel || 'medium',
      };
    } catch (error) {
      this.logger.error(
        `Failed to parse execution plan response: ${error.message}`,
      );
      throw error;
    }
  }

  private parsePriorityResponse(response: string): Record<string, number> {
    try {
      return JSON.parse(response);
    } catch (error) {
      this.logger.error(`Failed to parse priority response: ${error.message}`);
      return {};
    }
  }

  private createFallbackAnalysis(
    task: JiraTask | KanbanTaskSummary,
  ): TaskAnalysisResult {
    const summary = (
      'summary' in task ? task.summary : task.fields.summary
    ).toLowerCase();

    let analysisType: TaskAnalysisResult['analysisType'] = 'unknown';
    let complexity: TaskAnalysisResult['complexity'] = 'medium';
    let canAutoExecute = false;
    let requiredActions = ['Требует анализа'];

    // Простые эвристики
    if (
      summary.includes('create') ||
      summary.includes('создать') ||
      summary.includes('add')
    ) {
      analysisType = 'code';
      // Автоматически выполняем простые задачи создания
      if (
        summary.includes('entity') ||
        summary.includes('сущность') ||
        summary.includes('file') ||
        summary.includes('файл')
      ) {
        canAutoExecute = true;
        requiredActions = ['Создать файл на основе шаблона'];
      }
    } else if (summary.includes('test') || summary.includes('тест')) {
      analysisType = 'testing';
    } else if (summary.includes('doc') || summary.includes('документ')) {
      analysisType = 'documentation';
    }

    if (
      summary.includes('simple') ||
      summary.includes('простой') ||
      summary.includes('quick')
    ) {
      complexity = 'low';
      canAutoExecute = true; // Простые задачи можно выполнять автоматически
      requiredActions = ['Выполнить простую задачу'];
    } else if (
      summary.includes('complex') ||
      summary.includes('сложн') ||
      summary.includes('major')
    ) {
      complexity = 'high';
    }

    return {
      taskKey: task.key,
      summary: 'summary' in task ? task.summary : task.fields.summary,
      analysisType,
      complexity,
      estimatedTime:
        complexity === 'low' ? 15 : complexity === 'high' ? 60 : 30,
      requiredActions,
      canAutoExecute,
      reasoning: canAutoExecute
        ? 'Simple task - can auto-execute with fallback analysis'
        : 'Fallback analysis - AI not available',
    };
  }
}
