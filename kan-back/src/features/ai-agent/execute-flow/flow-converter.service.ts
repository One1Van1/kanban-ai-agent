import { Injectable, Logger } from '@nestjs/common';
import {
  FlowDefinition,
  FlowNode,
  FlowEdge,
} from '../execute-flow/execute-flow.request.dto';

export interface FlowConversionContext {
  variables: Map<string, any>;
  conditions: string[];
  loops: string[];
  errorHandling: string[];
  asyncOperations: string[];
}

export interface ConvertedFlowInstruction {
  instruction: string;
  priority: number;
  dependencies: string[];
  variables: string[];
  errorHandling?: string;
  timeout?: number;
  retries?: number;
}

@Injectable()
export class FlowConverterService {
  private readonly logger = new Logger(FlowConverterService.name);

  /**
   * Интеллектуально конвертирует Flow Definition в детальные Agent Instructions
   */
  async convertFlowToInstructions(
    flow: FlowDefinition,
    taskKey: string,
    initialContext?: Record<string, any>,
  ): Promise<ConvertedFlowInstruction[]> {
    this.logger.log(
      `🧠 Converting Flow "${flow.name}" (${flow.nodes.length} nodes) to intelligent instructions`,
    );

    // Инициализируем контекст выполнения
    const context: FlowConversionContext = {
      variables: new Map(Object.entries(initialContext || {})),
      conditions: [],
      loops: [],
      errorHandling: [],
      asyncOperations: [],
    };

    // Анализируем связи между узлами для понимания последовательности
    const executionOrder = this.analyzeFlowConnections(
      flow.nodes,
      flow.edges || [],
    );

    // Конвертируем узлы в инструкции с учетом порядка выполнения
    const instructions: ConvertedFlowInstruction[] = [];

    for (const nodeId of executionOrder) {
      const node = flow.nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      const instruction = await this.convertNodeToSmartInstruction(
        node,
        context,
        taskKey,
        instructions.length,
      );

      if (instruction) {
        instructions.push(instruction);
        this.updateContextFromNode(context, node, instruction);
      }
    }

    // Добавляем финальную инструкцию с обработкой результата
    instructions.push(this.createFinalInstruction(context, taskKey));

    this.logger.log(
      `✅ Generated ${instructions.length} intelligent instructions for Flow "${flow.name}"`,
    );

    return instructions;
  }

  /**
   * Анализирует связи между узлами и определяет порядок выполнения
   */
  private analyzeFlowConnections(
    nodes: FlowNode[],
    edges: FlowEdge[],
  ): string[] {
    // Создаем граф зависимостей
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Инициализируем граф
    nodes.forEach((node) => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Строим граф из edges
    edges.forEach((edge) => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Топологическая сортировка (алгоритм Кана)
    const queue: string[] = [];
    const result: string[] = [];

    // Находим узлы без входящих связей (стартовые узлы)
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    // Если нет стартовых узлов, начинаем с trigger узлов
    if (queue.length === 0) {
      const triggerNodes = nodes.filter((node) => node.type === 'trigger');
      triggerNodes.forEach((node) => queue.push(node.id));
    }

    // Выполняем топологическую сортировку
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      result.push(currentId);

      graph.get(currentId)?.forEach((neighborId) => {
        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      });
    }

    // Если остались необработанные узлы (циклы), добавляем их в конец
    nodes.forEach((node) => {
      if (!result.includes(node.id)) {
        result.push(node.id);
      }
    });

    return result;
  }

  /**
   * Конвертирует узел в умную инструкцию с контекстом
   */
  private async convertNodeToSmartInstruction(
    node: FlowNode,
    context: FlowConversionContext,
    taskKey: string,
    step: number,
  ): Promise<ConvertedFlowInstruction | null> {
    const config = node.data?.config || {};

    switch (node.type) {
      case 'trigger':
        return this.createTriggerInstruction(node, config, step);
      case 'context':
        return this.createContextInstruction(node, config, context, step);
      case 'logic':
        return this.createLogicInstruction(node, config, context, step);
      case 'action':
        return this.createActionInstruction(
          node,
          config,
          context,
          taskKey,
          step,
        );
      case 'wait':
        return this.createWaitInstruction(node, config, step);
      case 'loop':
        return this.createLoopInstruction(node, config, context, step);
      case 'condition':
        return this.createConditionInstruction(node, config, context, step);
      default:
        this.logger.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }

  private createTriggerInstruction(
    node: FlowNode,
    config: any,
    step: number,
  ): ConvertedFlowInstruction {
    let instruction = '';

    if (config.boardType === 'jira' && config.event === 'card_moved') {
      instruction = `ШАГ ${step + 1}: Триггер активирован - карточка перемещена в колонку "${config.targetColumn}". Начинаю выполнение Flow-процесса.`;
    } else {
      instruction = `ШАГ ${step + 1}: Триггер активирован - событие "${config.event || 'system_event'}" произошло. Инициирую выполнение процесса.`;
    }

    return {
      instruction,
      priority: 0, // Триггеры имеют высший приоритет
      dependencies: [],
      variables: [],
    };
  }

  private createContextInstruction(
    node: FlowNode,
    config: any,
    context: FlowConversionContext,
    step: number,
  ): ConvertedFlowInstruction {
    const variableName = config.variableName || 'context_data';
    let instruction = '';

    if (config.type === 'extract_files') {
      instruction = `ШАГ ${step + 1}: Получи все файлы из карточки`;
      if (config.filterByUser) {
        instruction += ` от пользователя "${config.filterByUser}"`;
      }
      instruction += `. Сохрани список файлов в переменную "${variableName}". 
      Для каждого файла сохрани: имя, размер, тип, URL, дату загрузки, автора.
      Если файлов нет, установи "${variableName}" = []`;
    } else if (config.type === 'extract_task_data') {
      instruction = `ШАГ ${step + 1}: Извлеки данные карточки: описание, статус, приоритет, исполнитель, теги, дату создания. 
      Сохрани в переменную "${variableName}" как JSON объект.`;
    } else {
      instruction = `ШАГ ${step + 1}: Собери контекстную информацию по типу "${config.type}" и сохрани в переменную "${variableName}".`;
    }

    return {
      instruction,
      priority: 1,
      dependencies: [],
      variables: [variableName],
      timeout: config.timeout || 30,
    };
  }

  private createLogicInstruction(
    node: FlowNode,
    config: any,
    context: FlowConversionContext,
    step: number,
  ): ConvertedFlowInstruction {
    const variable = config.variable || 'unknown_var';
    const condition = config.condition || 'exists';

    let instruction = '';

    switch (condition) {
      case 'empty':
        instruction = `ШАГ ${step + 1}: Проверь переменную "${variable}". ЕСЛИ она пустая (null, undefined, [], "" или {}):`;
        break;
      case 'not_empty':
        instruction = `ШАГ ${step + 1}: Проверь переменную "${variable}". ЕСЛИ она НЕ пустая и содержит данные:`;
        break;
      case 'equals':
        instruction = `ШАГ ${step + 1}: Проверь переменную "${variable}". ЕСЛИ она равна "${config.value}":`;
        break;
      case 'contains':
        instruction = `ШАГ ${step + 1}: Проверь переменную "${variable}". ЕСЛИ она содержит "${config.value}":`;
        break;
      case 'greater_than':
        instruction = `ШАГ ${step + 1}: Проверь переменную "${variable}". ЕСЛИ она больше ${config.value}:`;
        break;
      default:
        instruction = `ШАГ ${step + 1}: Проверь условие для переменной "${variable}":`;
    }

    // Добавляем информацию о ветвлении
    if (config.trueBranch) {
      instruction += `\n  ТОГДА: выполни действия из ветки "${config.trueBranch}"`;
    }
    if (config.falseBranch) {
      instruction += `\n  ИНАЧЕ: выполни действия из ветки "${config.falseBranch}"`;
    }

    context.conditions.push(`${variable}_${condition}`);

    return {
      instruction,
      priority: 2,
      dependencies: [variable],
      variables: [variable],
    };
  }

  private createActionInstruction(
    node: FlowNode,
    config: any,
    context: FlowConversionContext,
    taskKey: string,
    step: number,
  ): ConvertedFlowInstruction {
    let instruction = '';
    let variables: string[] = [];
    let errorHandling = '';
    let timeout = 30;
    let retries = 1;

    switch (config.type) {
      case 'comment':
        instruction = `ШАГ ${step + 1}: Добавь комментарий в карточку ${taskKey}: "${config.text || 'Автоматический комментарий'}"`;
        errorHandling =
          'Если добавление комментария не удалось, логируй ошибку и продолжай выполнение';
        break;

      case 'ai_request':
        const aiModel = config.aiModel || 'claude-3-sonnet';
        const prompt = config.prompt || 'Проанализируй данные';
        const attachments = config.attachments || [];

        instruction = `ШАГ ${step + 1}: Отправь запрос к AI модели "${aiModel}":
        ПРОМПТ: "${prompt}"`;

        if (attachments.length > 0) {
          instruction += `\n        ФАЙЛЫ: прикрепи файлы из переменных: ${attachments.join(', ')}`;
          variables.push(...attachments);
        }

        instruction += `\n        Сохрани ответ AI в переменную "${config.responseVariable || 'ai_response'}"`;
        variables.push(config.responseVariable || 'ai_response');

        timeout = config.timeout || 120;
        retries = 2;
        errorHandling =
          'Если AI запрос не удался, попробуй еще раз через 10 секунд. После 2 неудач сохрани ошибку в переменную ai_error';
        break;

      case 'create_file':
        instruction = `ШАГ ${step + 1}: Создай файл "${config.fileName || 'report.docx'}"`;
        if (config.contentVariable) {
          instruction += ` с содержимым из переменной "${config.contentVariable}"`;
          variables.push(config.contentVariable);
        }
        instruction += `. Сохрани путь к файлу в переменную "${config.fileVariable || 'created_file'}"`;
        variables.push(config.fileVariable || 'created_file');
        break;

      case 'attach_file':
        const fileVar = config.fileVariable || 'created_file';
        instruction = `ШАГ ${step + 1}: Прикрепи файл из переменной "${fileVar}" к карточке ${taskKey}`;
        variables.push(fileVar);
        errorHandling =
          'Если прикрепление файла не удалось, сохрани ошибку в логи';
        break;

      case 'email_notification':
        instruction = `ШАГ ${step + 1}: Отправь email уведомление:
        ПОЛУЧАТЕЛИ: ${config.recipients || 'исполнитель карточки'}
        ТЕМА: "${config.subject || 'Уведомление от AI системы'}"
        ТЕКСТ: "${config.text || 'Автоматическое уведомление'}"`;
        errorHandling =
          'Если отправка email не удалась, попробуй еще раз через 5 секунд';
        retries = 2;
        break;

      case 'telegram_notification':
        instruction = `ШАГ ${step + 1}: Отправь Telegram уведомление:
        ПОЛУЧАТЕЛИ: ${config.recipients || 'исполнитель карточки'}
        СООБЩЕНИЕ: "${config.text || 'Автоматическое уведомление'}"`;
        errorHandling = 'Если отправка Telegram не удалась, логируй ошибку';
        break;

      case 'move_task':
        instruction = `ШАГ ${step + 1}: Перемести карточку ${taskKey} в колонку "${config.targetColumn}"`;
        if (config.comment) {
          instruction += ` и добавь комментарий: "${config.comment}"`;
        }
        errorHandling =
          'Если перемещение не удалось, попробуй еще раз через 5 секунд';
        retries = 2;
        break;

      case 'update_field':
        instruction = `ШАГ ${step + 1}: Обнови поле "${config.fieldName}" карточки ${taskKey} значением `;
        if (config.valueVariable) {
          instruction += `из переменной "${config.valueVariable}"`;
          variables.push(config.valueVariable);
        } else {
          instruction += `"${config.value}"`;
        }
        break;

      default:
        instruction = `ШАГ ${step + 1}: Выполни действие "${config.type}" с параметрами: ${JSON.stringify(config)}`;
    }

    context.asyncOperations.push(node.id);

    return {
      instruction,
      priority: 3,
      dependencies: variables,
      variables,
      errorHandling,
      timeout,
      retries,
    };
  }

  private createWaitInstruction(
    node: FlowNode,
    config: any,
    step: number,
  ): ConvertedFlowInstruction {
    let instruction = '';

    if (config.type === 'ai_response') {
      instruction = `ШАГ ${step + 1}: Дождись завершения AI запроса (максимум ${config.timeout || 300} секунд). Проверяй статус каждые 5 секунд.`;
    } else if (config.type === 'user_action') {
      instruction = `ШАГ ${step + 1}: Дождись действия пользователя "${config.action}" в карточке (максимум ${config.timeout || 3600} секунд).`;
    } else {
      instruction = `ШАГ ${step + 1}: Подожди ${config.duration || 5} секунд перед продолжением выполнения.`;
    }

    return {
      instruction,
      priority: 4,
      dependencies: [],
      variables: [],
      timeout: config.timeout || config.duration || 30,
    };
  }

  private createLoopInstruction(
    node: FlowNode,
    config: any,
    context: FlowConversionContext,
    step: number,
  ): ConvertedFlowInstruction {
    const arrayVar = config.arrayVariable || 'items';
    const itemVar = config.itemVariable || 'current_item';
    const maxIterations = config.maxIterations || 100;

    const instruction = `ШАГ ${step + 1}: ЦИКЛ по массиву "${arrayVar}":
    ДЛЯ КАЖДОГО элемента (сохраняй в "${itemVar}"):
      - Максимум ${maxIterations} итераций
      - Если массив пустой, пропусти цикл
      - В каждой итерации выполняй действия блока "${config.loopBodyId}"`;

    context.loops.push(`${arrayVar}_loop`);

    return {
      instruction,
      priority: 2,
      dependencies: [arrayVar],
      variables: [itemVar],
      timeout: (config.timeout || 30) * maxIterations,
    };
  }

  private createConditionInstruction(
    node: FlowNode,
    config: any,
    context: FlowConversionContext,
    step: number,
  ): ConvertedFlowInstruction {
    const conditions = config.conditions || [];
    const operator = config.operator || 'AND';

    let instruction = `ШАГ ${step + 1}: Проверь составное условие (${operator}):`;

    conditions.forEach((cond: any, index: number) => {
      instruction += `\n    ${index + 1}. "${cond.variable}" ${cond.operator} "${cond.value}"`;
    });

    instruction += `\n  ЕСЛИ все условия выполнены: выполни ветку "${config.trueBranch}"`;
    instruction += `\n  ИНАЧЕ: выполни ветку "${config.falseBranch}"`;

    const variables = conditions.map((c: any) => c.variable);

    return {
      instruction,
      priority: 2,
      dependencies: variables,
      variables,
    };
  }

  private createFinalInstruction(
    context: FlowConversionContext,
    taskKey: string,
  ): ConvertedFlowInstruction {
    const variables = Array.from(context.variables.keys());

    return {
      instruction: `ФИНАЛЬНЫЙ ШАГ: Завершение Flow выполнения:
      - Сохрани все переменные: ${variables.join(', ')}
      - Логируй результат выполнения
      - Отправь статус "completed" 
      - Если были ошибки, включи их в финальный отчет
      - Очисти временные файлы и данные`,
      priority: 10,
      dependencies: variables,
      variables: ['flow_result', 'execution_summary'],
    };
  }

  /**
   * Обновляет контекст на основе выполненного узла
   */
  private updateContextFromNode(
    context: FlowConversionContext,
    node: FlowNode,
    instruction: ConvertedFlowInstruction,
  ): void {
    // Добавляем новые переменные в контекст
    instruction.variables.forEach((varName) => {
      if (!context.variables.has(varName)) {
        context.variables.set(varName, null);
      }
    });

    // Добавляем обработку ошибок
    if (instruction.errorHandling) {
      context.errorHandling.push(instruction.errorHandling);
    }
  }

  /**
   * Объединяет инструкции в финальный текст для AI
   */
  generateFinalInstructionText(
    instructions: ConvertedFlowInstruction[],
  ): string {
    const sortedInstructions = instructions.sort(
      (a, b) => a.priority - b.priority,
    );

    let finalText = `
ИНТЕЛЛЕКТУАЛЬНЫЕ AI ИНСТРУКЦИИ ДЛЯ ВЫПОЛНЕНИЯ FLOW:

ВАЖНЫЕ ПРИНЦИПЫ:
- Выполняй шаги последовательно в указанном порядке
- Сохраняй ВСЕ переменные для использования в следующих шагах
- При ошибках следуй указанной логике обработки ошибок
- Логируй каждый шаг для отладки
- Не прерывай выполнение при нескритичных ошибках

ИНСТРУКЦИИ К ВЫПОЛНЕНИЮ:

`;

    sortedInstructions.forEach((instruction) => {
      finalText += `${instruction.instruction}\n\n`;

      if (instruction.dependencies.length > 0) {
        finalText += `  ТРЕБУЮТСЯ ПЕРЕМЕННЫЕ: ${instruction.dependencies.join(', ')}\n`;
      }

      if (instruction.errorHandling) {
        finalText += `  ОБРАБОТКА ОШИБОК: ${instruction.errorHandling}\n`;
      }

      if (instruction.timeout) {
        finalText += `  ТАЙМАУТ: ${instruction.timeout} секунд\n`;
      }

      finalText += `\n`;
    });

    finalText += `
ФИНАЛЬНЫЕ ТРЕБОВАНИЯ:
- Верни детальный отчет о выполнении каждого шага
- Укажи статус: success/partial_success/failed
- Включи все созданные переменные и их значения
- Добавь рекомендации по улучшению процесса
`;

    return finalText.trim();
  }
}
