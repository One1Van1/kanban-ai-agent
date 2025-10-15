import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { CreateAgentService } from './create-agent.service';
import { ConfigureColumnInstructionsService } from '../configure-column-instructions/configure-column-instructions.service';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
import { ApiCreateAgent } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('CreateAgent')
export class CreateAgentController {
  private readonly logger = new Logger(CreateAgentController.name);

  constructor(
    private readonly createAgentService: CreateAgentService,
    private readonly configureColumnInstructionsService: ConfigureColumnInstructionsService,
  ) {}

  @Post()
  @ApiCreateAgent()
  async handle(
    @Body() requestDto: CreateAgentRequestDto,
  ): Promise<CreateAgentResponseDto> {
    this.logger.log(`Received request to create AI agent: ${requestDto.name}`);
    return this.createAgentService.execute(requestDto);
  }

  @Post('flow-builder/save-flow')
  @ApiOperation({
    summary: 'Save Flow from Frontend and convert to Agent Instructions',
  })
  @ApiResponse({
    status: 200,
    description: 'Flow saved and converted successfully',
  })
  async saveFlow(@Body() body: any) {
    const flowDefinition = body.flowDefinition;
    this.logger.log(
      `💾 Saving Flow: ${flowDefinition?.name || 'Unnamed Flow'}`,
    );

    try {
      // 1. Создаем агента
      const agentResult = await this.createAgentService.execute({
        name: flowDefinition?.name || 'Flow-Generated Agent',
        description:
          flowDefinition?.description || 'Agent created from Flow Builder',
        instructions: this.generateAgentInstructions(
          flowDefinition?.blocks || [],
          flowDefinition?.edges || [],
        ),
        model: 'claude-3-5-sonnet-20241022',
        isActive: true,
        userId: 'flow-system',
      });
      const agent = agentResult.agent;

      // 2. Создаем column instructions для каждого триггера
      const instructions = [];
      for (const trigger of flowDefinition?.triggers || []) {
        if (trigger.type === 'board_move') {
          const instructionResult =
            await this.configureColumnInstructionsService.execute({
              agentId: agent.id,
              boardId: trigger.config.boardId || 'default',
              columnId: trigger.config.targetColumn,
              columnName: trigger.config.targetColumn,
              instructions: this.generateColumnInstruction(
                flowDefinition.blocks,
              ),
              triggerConditions: [],
              isActive: true,
            });
          instructions.push(instructionResult);
        }
      }

      this.logger.log(
        `✅ Flow "${flowDefinition?.name || 'Unnamed'}" converted successfully`,
      );

      return {
        success: true,
        message: `Flow "${flowDefinition?.name || 'Unnamed'}" saved and converted to agent instructions`,
        flowId: flowDefinition?.id || randomUUID(), // Правильный ID
        flow: flowDefinition, // Возвращаем сохраненный flow
        createdAgent: {
          // Упрощенная информация об агенте
          id: agent.id,
          name: agent.name,
          description: agent.description,
          isActive: agent.isActive,
        },
        createdInstructions: instructions,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to save Flow: ${error.message}`);
      throw error;
    }
  }

  private generateAgentInstructions(
    blocks: any[] = [],
    edges: any[] = [],
  ): string {
    const instructions = [
      'Ты - AI агент для автоматического выполнения задач в Kanban досках.',
    ];

    if (!Array.isArray(blocks)) {
      this.logger.warn('Blocks is not an array, using empty array');
      blocks = [];
    }

    // Сортируем блоки по последовательности выполнения
    const sortedBlocks = this.sortBlocksByFlow(blocks, edges);

    if (sortedBlocks.length > 0) {
      instructions.push('\n📋 Последовательность действий:');
    }

    sortedBlocks.forEach((block, index) => {
      switch (block.type) {
        case 'extract_files':
          const fileTypes = block.config?.fileTypes || ['все файлы'];
          const analysisType =
            block.config?.analysisType || 'анализируй содержимое';
          instructions.push(
            `${index + 1}. Извлекай ${fileTypes.join(', ')} и ${analysisType}`,
          );
          break;
        case 'ai_request':
          const prompt = block.config?.prompt || 'Выполни AI анализ';
          instructions.push(`${index + 1}. Выполняй AI анализ: "${prompt}"`);
          break;
        case 'comment':
          const message =
            block.config?.message || 'Добавь комментарий с результатами';
          instructions.push(`${index + 1}. Добавляй комментарии: "${message}"`);
          break;

        // Action блоки
        case 'api_call':
          const apiUrl = block.config?.url || 'внешний API';
          const method = block.config?.method || 'GET';
          instructions.push(`- Выполняй ${method} запросы к: ${apiUrl}`);
          break;
        case 'create_file':
          const fileName = block.config?.fileName || 'документ';
          const fileType = block.config?.fileType || 'отчет';
          instructions.push(
            `- Создавай файл "${fileName}" (${fileType}) и прикрепляй к задачам`,
          );
          break;
        case 'attach_file':
          const attachAction = block.config?.action || 'обработку';
          const attachFileTypes = block.config?.fileTypes
            ? ` (${block.config.fileTypes.join(', ')})`
            : '';
          instructions.push(
            `- Выполняй ${attachAction} прикрепленных файлов${attachFileTypes}`,
          );
          break;
        case 'send_notification':
          const notificationMessage = block.config?.message || 'уведомление';
          const recipient = block.config?.recipient || 'пользователям';
          instructions.push(
            `- Отправляй ${recipient}: "${notificationMessage}"`,
          );
          break;
        case 'move_card':
          const targetColumn =
            block.config?.targetColumn || 'следующую колонку';
          instructions.push(
            `${index + 1}. Перемещай карточки в колонку: "${targetColumn}"`,
          );
          break;
        case 'update_field':
          if (block.config?.field && block.config?.value) {
            instructions.push(
              `${index + 1}. Обновляй поле "${block.config.field}" значением "${block.config.value}"`,
            );
          } else {
            instructions.push(
              `${index + 1}. Обновляй поля задач (приоритет, статус, метки, описание)`,
            );
          }
          break;

        // Wait блоки
        case 'wait_response':
          const responseFrom = block.config?.from || 'пользователей';
          const responseType =
            block.config?.responseType || 'ответа или реакции';
          instructions.push(
            `- Жди ${responseType} от ${responseFrom} перед продолжением`,
          );
          break;
        case 'wait_timeout':
        case 'wait_time':
          const timeout =
            block.config?.timeout || block.config?.duration || '1 час';
          const waitReason =
            block.config?.reason || 'перед выполнением следующего действия';
          instructions.push(`- Делай паузу ${timeout} ${waitReason}`);
          break;
        case 'wait_condition':
          const condition = block.config?.condition || 'определенное условие';
          const checkInterval = block.config?.checkInterval || 'периодически';
          instructions.push(
            `- Жди выполнения условия: "${condition}" (проверяй ${checkInterval})`,
          );
          break;

        // Logic блоки
        case 'if_condition':
          const ifCondition = block.config?.condition || 'условие выполнено';
          const thenAction =
            block.config?.thenAction || 'выполни следующие действия';
          const elseAction = block.config?.elseAction
            ? `, иначе ${block.config.elseAction}`
            : '';
          instructions.push(
            `- Если ${ifCondition}, то ${thenAction}${elseAction}`,
          );
          break;
        case 'switch_condition':
          const variable = block.config?.variable || 'переменной';
          const cases = block.config?.cases || [];
          if (cases.length > 0) {
            instructions.push(
              `- Выбери действие в зависимости от значения ${variable}:`,
            );
            cases.forEach((caseItem: any, index: number) => {
              instructions.push(
                `  ${index + 1}. Если ${caseItem.condition} → ${caseItem.action}`,
              );
            });
          } else {
            instructions.push(
              `- Выбери действие в зависимости от значения ${variable}`,
            );
          }
          break;

        // Context блоки
        case 'context':
        case 'set_variable':
          const variableName =
            block.config?.variableName || block.config?.name || 'переменная';
          const variableValue =
            block.config?.variableValue || block.config?.value || 'значение';
          instructions.push(
            `- Установи переменную "${variableName}" = "${variableValue}"`,
          );
          break;
        case 'get_variable':
          const getVariableName =
            block.config?.variableName || block.config?.name || 'переменная';
          instructions.push(
            `- Получи значение переменной "${getVariableName}"`,
          );
          break;

        // Result блоки
        case 'result':
        case 'return_result':
          const resultValue =
            block.config?.value ||
            block.config?.result ||
            'результат выполнения';
          instructions.push(`- Верни результат: "${resultValue}"`);
          break;

        default:
          this.logger.warn(`Unknown block type: ${block.type}`);
          instructions.push(
            `${index + 1}. Обработай блок типа "${block.type}" (требует уточнения)`,
          );
      }
    });

    return instructions.join('\n');
  }

  private sortBlocksByFlow(blocks: any[], edges: any[]): any[] {
    if (!edges || edges.length === 0) {
      // Если нет связей, возвращаем блоки как есть
      return blocks;
    }

    // Создаем граф связей
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Инициализируем граф
    blocks.forEach((block) => {
      graph.set(block.id, []);
      inDegree.set(block.id, 0);
    });

    // Заполняем граф связями
    edges.forEach((edge) => {
      if (graph.has(edge.source) && graph.has(edge.target)) {
        graph.get(edge.source)?.push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      }
    });

    // Топологическая сортировка
    const result: any[] = [];
    const queue: string[] = [];

    // Находим блоки без входящих связей (стартовые)
    inDegree.forEach((degree, blockId) => {
      if (degree === 0) {
        queue.push(blockId);
      }
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentBlock = blocks.find((b) => b.id === currentId);

      if (currentBlock) {
        result.push(currentBlock);
      }

      // Обрабатываем соседей
      graph.get(currentId)?.forEach((neighborId) => {
        const newDegree = (inDegree.get(neighborId) || 1) - 1;
        inDegree.set(neighborId, newDegree);

        if (newDegree === 0) {
          queue.push(neighborId);
        }
      });
    }

    // Добавляем оставшиеся блоки (не связанные)
    blocks.forEach((block) => {
      if (!result.find((b) => b.id === block.id)) {
        result.push(block);
      }
    });

    return result;
  }

  private generateColumnInstruction(blocks: any[] = []): string {
    const steps = ['Когда задача попадает в эту колонку:'];

    if (!Array.isArray(blocks)) {
      this.logger.warn(
        'Blocks is not an array for column instruction, using empty array',
      );
      blocks = [];
    }

    blocks.forEach((block, index) => {
      switch (block.type) {
        case 'extract_files':
          steps.push(`${index + 1}. Извлеки все прикрепленные файлы`);
          if (block.config?.fileTypes) {
            steps.push(
              `   - Типы файлов: ${block.config.fileTypes.join(', ')}`,
            );
          }
          if (block.config?.analysisType) {
            steps.push(`   - Анализ: ${block.config.analysisType}`);
          }
          break;
        case 'ai_request':
          steps.push(`${index + 1}. Выполни AI анализ`);
          if (block.config?.prompt) {
            steps.push(`   - Промпт: "${block.config.prompt}"`);
          }
          break;
        case 'comment':
          steps.push(`${index + 1}. Добавь комментарий с результатами`);
          if (block.config?.message) {
            steps.push(`   - Текст: "${block.config.message}"`);
          }
          break;

        // Action блоки
        case 'api_call':
          steps.push(`${index + 1}. Выполни HTTP запрос к внешнему API`);
          if (block.config?.url) {
            steps.push(`   - URL: ${block.config.url}`);
          }
          break;
        case 'create_file':
          steps.push(`${index + 1}. Создай и прикрепи файл`);
          if (block.config?.fileName) {
            steps.push(`   - Имя файла: ${block.config.fileName}`);
          }
          break;
        case 'attach_file':
          steps.push(`${index + 1}. Обработай прикрепленные файлы`);
          if (block.config?.action) {
            steps.push(`   - Действие: ${block.config.action}`);
          }
          if (block.config?.fileTypes) {
            steps.push(
              `   - Типы файлов: ${block.config.fileTypes.join(', ')}`,
            );
          }
          break;
        case 'send_notification':
          steps.push(`${index + 1}. Отправь уведомление`);
          if (block.config?.message) {
            steps.push(`   - Сообщение: "${block.config.message}"`);
          }
          break;
        case 'move_card':
          steps.push(`${index + 1}. Перемести карточку`);
          if (block.config?.targetColumn) {
            steps.push(`   - В колонку: ${block.config.targetColumn}`);
          }
          break;
        case 'update_field':
          steps.push(`${index + 1}. Обнови поля задачи`);
          if (block.config?.field && block.config?.value) {
            steps.push(
              `   - Поле "${block.config.field}" = "${block.config.value}"`,
            );
          }
          break;

        // Wait блоки
        case 'wait_response':
          steps.push(`${index + 1}. Жди ответа от пользователя`);
          if (block.config?.from) {
            steps.push(`   - От кого: ${block.config.from}`);
          }
          if (block.config?.responseType) {
            steps.push(`   - Тип ответа: ${block.config.responseType}`);
          }
          break;
        case 'wait_timeout':
        case 'wait_time':
          const timeout =
            block.config?.timeout || block.config?.duration || '1 час';
          steps.push(`${index + 1}. Подожди ${timeout}`);
          if (block.config?.reason) {
            steps.push(`   - Причина: ${block.config.reason}`);
          }
          break;
        case 'wait_condition':
          steps.push(`${index + 1}. Жди выполнения условия`);
          if (block.config?.condition) {
            steps.push(`   - Условие: ${block.config.condition}`);
          }
          if (block.config?.checkInterval) {
            steps.push(`   - Проверять: ${block.config.checkInterval}`);
          }
          break;

        // Logic блоки
        case 'if_condition':
          steps.push(`${index + 1}. Проверь условие`);
          if (block.config?.condition) {
            steps.push(`   - Если: ${block.config.condition}`);
          }
          if (block.config?.thenAction) {
            steps.push(`   - То: ${block.config.thenAction}`);
          }
          if (block.config?.elseAction) {
            steps.push(`   - Иначе: ${block.config.elseAction}`);
          }
          break;
        case 'switch_condition':
          steps.push(`${index + 1}. Выбери действие в зависимости от условия`);
          if (block.config?.variable) {
            steps.push(`   - Переменная: ${block.config.variable}`);
          }
          if (block.config?.cases && block.config.cases.length > 0) {
            steps.push(`   - Варианты:`);
            block.config.cases.forEach((caseItem: any, caseIndex: number) => {
              steps.push(
                `     ${caseIndex + 1}. ${caseItem.condition} → ${caseItem.action}`,
              );
            });
          }
          break;

        // Context блоки
        case 'context':
        case 'set_variable':
          steps.push(`${index + 1}. Установи переменную`);
          if (block.config?.variableName || block.config?.name) {
            const varName = block.config?.variableName || block.config?.name;
            const varValue =
              block.config?.variableValue || block.config?.value || 'значение';
            steps.push(`   - "${varName}" = "${varValue}"`);
          }
          break;
        case 'get_variable':
          steps.push(`${index + 1}. Получи переменную`);
          if (block.config?.variableName || block.config?.name) {
            steps.push(
              `   - Имя: ${block.config?.variableName || block.config?.name}`,
            );
          }
          break;

        // Result блоки
        case 'result':
        case 'return_result':
          steps.push(`${index + 1}. Верни результат`);
          if (block.config?.value || block.config?.result) {
            steps.push(
              `   - Значение: ${block.config?.value || block.config?.result}`,
            );
          }
          break;

        default:
          steps.push(`${index + 1}. Обработай блок "${block.type}"`);
      }
    });

    return steps.join('\n');
  }
}
