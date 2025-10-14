import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ExecuteFlowRequestDto,
  FlowDefinition,
  FlowNode,
} from './execute-flow.request.dto';
import {
  ExecuteFlowResponseDto,
  FlowExecutionResult,
  FlowExecutionStep,
} from './execute-flow.response.dto';
import { ExecuteAgentActionService } from '../execute-agent-action/execute-agent-action.service';
import {
  ExecuteAgentActionRequestDto,
  AgentActionTrigger,
} from '../execute-agent-action/execute-agent-action.request.dto';
import {
  ExecuteAgentActionResponseDto,
  AgentActionResult,
} from '../execute-agent-action/execute-agent-action.response.dto';

@Injectable()
export class ExecuteFlowService {
  private readonly logger = new Logger(ExecuteFlowService.name);

  constructor(
    private readonly executeAgentActionService: ExecuteAgentActionService,
  ) {}

  async execute(
    requestDto: ExecuteFlowRequestDto,
  ): Promise<ExecuteFlowResponseDto> {
    const executionId = randomUUID();
    const startTime = new Date().toISOString();

    this.logger.log(
      `🚀 Starting Flow execution: ${requestDto.flowDefinition.name} for task: ${requestDto.taskKey}`,
    );

    try {
      // 1. Конвертируем Flow в Agent Instructions
      const agentInstructions = this.convertFlowToAgentInstructions(
        requestDto.flowDefinition,
      );

      this.logger.log(
        `🧠 Converted Flow to Agent Instructions: ${agentInstructions}`,
      );

      // 2. Создаем Agent Request
      const agentRequest: ExecuteAgentActionRequestDto = {
        agentId: 'flow-executor-agent',
        taskId: requestDto.taskKey,
        boardId: 'default-board',
        columnId: 'default-column',
        triggerType: AgentActionTrigger.MANUAL_TRIGGER,
        columnName: requestDto.triggerContext.columnName,
        taskData: {
          key: requestDto.taskKey,
          flowInstructions: agentInstructions,
          ...requestDto.triggerContext.taskData,
        },
        additionalContext: {
          flowDefinition: requestDto.flowDefinition,
          executionId,
        },
      };

      // 3. Выполняем через готовый Agent Action Service
      const agentResult =
        await this.executeAgentActionService.execute(agentRequest);

      // 4. Конвертируем результат Agent в Flow Response
      const isSuccess = agentResult.result === AgentActionResult.SUCCESS;

      const executionResult: FlowExecutionResult = {
        executionId,
        flowId: requestDto.flowDefinition.id,
        taskKey: requestDto.taskKey,
        status: isSuccess ? 'completed' : 'failed',
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        steps: this.convertAgentResultToFlowSteps(
          requestDto.flowDefinition.nodes,
          agentResult,
        ),
        variables: agentResult.metadata || {},
        error: isSuccess ? undefined : agentResult.error,
      };

      this.logger.log(
        `✅ Flow execution completed successfully: ${executionId}`,
      );

      return new ExecuteFlowResponseDto(
        executionId,
        requestDto.taskKey,
        executionResult,
        isSuccess
          ? 'Flow execution completed successfully'
          : `Flow execution completed with errors: ${agentResult.error || 'Unknown error'}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Flow execution failed: ${executionId}`,
        error.stack,
      );

      const failedResult: FlowExecutionResult = {
        executionId,
        flowId: requestDto.flowDefinition.id,
        taskKey: requestDto.taskKey,
        status: 'failed',
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        steps: [],
        variables: {},
        error: error.message,
      };

      return new ExecuteFlowResponseDto(
        executionId,
        requestDto.taskKey,
        failedResult,
        `Flow execution failed: ${error.message}`,
      );
    }
  }

  /**
   * Конвертирует Flow Definition в Agent Instructions на бизнес-языке
   */
  private convertFlowToAgentInstructions(flow: FlowDefinition): string {
    const instructions: string[] = [];

    // Анализируем узлы Flow и конвертируем в инструкции
    flow.nodes.forEach((node) => {
      const instruction = this.convertNodeToInstruction(node);
      if (instruction) {
        instructions.push(instruction);
      }
    });

    const fullInstruction = `
Выполни следующий AI-поток для карточки:

${instructions.join('\n')}

Важно:
- Если на каком-то шаге возникает ошибка, логируй её и переходи к следующему шагу
- Сохраняй все переменные в контексте для использования в следующих шагах  
- При работе с файлами проверяй их наличие и доступность
- Все комментарии добавляй в Jira карточку
- Все уведомления отправляй соответствующим пользователям
`;

    return fullInstruction.trim();
  }

  /**
   * Конвертирует отдельный узел Flow в инструкцию на бизнес-языке
   */
  private convertNodeToInstruction(node: FlowNode): string | null {
    switch (node.type) {
      case 'trigger':
        return this.convertTriggerNode(node);
      case 'context':
        return this.convertContextNode(node);
      case 'logic':
        return this.convertLogicNode(node);
      case 'action':
        return this.convertActionNode(node);
      case 'wait':
        return this.convertWaitNode(node);
      default:
        this.logger.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }

  private convertTriggerNode(node: FlowNode): string {
    const config = node.data.config || {};

    if (config.boardType === 'jira' && config.event === 'card_moved') {
      return `Триггер: Карточка перемещена в колонку "${config.targetColumn || 'целевую колонку'}"`;
    }

    return 'Триггер: Событие в системе произошло';
  }

  private convertContextNode(node: FlowNode): string {
    const config = node.data.config || {};

    if (config.type === 'extract_files') {
      return `Получи файлы карточки от пользователя "${config.filterByUser || 'любого пользователя'}" и сохрани их в переменную "${config.variableName || 'files'}"`;
    }

    return `Собери контекстную информацию и сохрани в переменную "${config.variableName || 'context'}"`;
  }

  private convertLogicNode(node: FlowNode): string {
    const config = node.data.config || {};

    if (config.type === 'if_else') {
      return `Если переменная "${config.variable}" ${config.condition === 'empty' ? 'пустая' : 'не пустая'}:`;
    }

    return 'Выполни условную логику';
  }

  private convertActionNode(node: FlowNode): string {
    const config = node.data.config || {};

    switch (config.type) {
      case 'comment':
        return `- Добавь комментарий: "${config.text || 'Комментарий'}"`;
      case 'ai_request':
        return `- Отправь запрос к AI модели "${config.aiModel || 'claude'}" с промптом: "${config.prompt || 'Проанализируй данные'}" и файлами из переменной "${config.attachments?.join(', ') || 'files'}"`;
      case 'create_file':
        return `- Создай файл "${config.fileName || 'report.docx'}" с содержимым из AI ответа`;
      case 'attach_file':
        return `- Прикрепи созданный файл к карточке`;
      case 'email_notification':
        return `- Отправь email уведомление: "${config.text || 'Уведомление'}"`;
      case 'telegram_notification':
        return `- Отправь Telegram уведомление: "${config.text || 'Уведомление'}"`;
      default:
        return `- Выполни действие: ${config.type || 'неизвестное действие'}`;
    }
  }

  private convertWaitNode(node: FlowNode): string {
    const config = node.data.config || {};

    if (config.type === 'ai_response') {
      return `Дождись завершения AI запроса (максимум ${config.timeout || 300} секунд)`;
    }

    return `Подожди ${config.duration || 5} секунд`;
  }

  /**
   * Конвертирует результат Agent в шаги Flow для ответа
   */
  private convertAgentResultToFlowSteps(
    nodes: FlowNode[],
    agentResult: ExecuteAgentActionResponseDto,
  ): FlowExecutionStep[] {
    const steps: FlowExecutionStep[] = [];
    const isSuccess = agentResult.result === AgentActionResult.SUCCESS;

    nodes.forEach((node) => {
      steps.push({
        stepId: node.id,
        stepType: node.type,
        status: isSuccess ? 'completed' : 'failed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        result: isSuccess
          ? {
              executed: true,
              actions: agentResult.actions,
              summary: agentResult.summary,
            }
          : undefined,
        error: isSuccess ? undefined : agentResult.error,
      });
    });

    return steps;
  }
}
