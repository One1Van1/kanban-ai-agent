import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Flow } from '../../entities/flow.entity';
import { FlowAnalyzerService } from './flow-analyzer.service';
import {
  BlockConverterService,
  ConvertedBlock,
} from './block-converter.service';
import { FlowAnalysisResult } from '../../types/flow-definition.types';

/**
 * Результат конвертации Flow в Agent
 */
export interface FlowToAgentConversionResult {
  success: boolean;
  agentName: string;
  agentDescription: string;
  triggerConfig: {
    type: string;
    columnName: string;
    columnId: string; // Добавлено для правильной привязки
    event: string; // on_enter, on_exit, on_update
    conditions?: any;
  };
  instructionText: string; // Полный текст инструкции для AI
  metadata: {
    sourceFlowId: string;
    sourceFlowName: string;
    convertedAt: string;
    totalBlocks: number;
    analysisResult: FlowAnalysisResult;
  };
}

/**
 * Главный сервис конвертации Flow → Agent
 */
@Injectable()
export class ConvertFlowToAgentService {
  private readonly logger = new Logger(ConvertFlowToAgentService.name);

  constructor(
    private readonly flowAnalyzer: FlowAnalyzerService,
    private readonly blockConverter: BlockConverterService,
  ) {}

  /**
   * Конвертирует Flow в Agent конфигурацию
   */
  async convertFlowToAgent(flow: Flow): Promise<FlowToAgentConversionResult> {
    this.logger.log(`🔄 Starting Flow → Agent conversion for: ${flow.name}`);

    try {
      // 1. Анализ Flow
      this.logger.log('📊 Analyzing Flow structure...');
      const analysisResult = await this.flowAnalyzer.analyzeFlow(
        flow.definition,
      );

      // 2. Валидация
      if (!analysisResult.isValid) {
        throw new BadRequestException(
          `Flow validation failed: ${analysisResult.errors.join(', ')}`,
        );
      }

      if (analysisResult.warnings.length > 0) {
        this.logger.warn(
          `⚠️  Flow has warnings: ${analysisResult.warnings.join(', ')}`,
        );
      }

      // 3. Извлечение trigger конфигурации
      this.logger.log('🎯 Extracting trigger configuration...');
      const triggerConfig = this.extractTriggerConfig(flow);

      // 4. Конвертация всех блоков Flow в текстовую инструкцию
      this.logger.log('📝 Converting all Flow blocks to instruction steps...');
      const instructionSteps = await this.convertBlocksToInstructions(
        flow,
        analysisResult,
      );

      // 5. Формируем полную инструкцию для AI: триггер + вся логика Flow
      const instructionText = this.buildFullInstruction(
        triggerConfig,
        instructionSteps,
      );

      // 6. Формирование результата
      const result: FlowToAgentConversionResult = {
        success: true,
        agentName: `Agent: ${flow.name}`,
        agentDescription:
          flow.description ||
          `Agent automatically created from Flow "${flow.name}"`,
        triggerConfig,
        instructionText,
        metadata: {
          sourceFlowId: flow.id,
          sourceFlowName: flow.name,
          convertedAt: new Date().toISOString(),
          totalBlocks: flow.definition.blocks.length,
          analysisResult,
        },
      };

      this.logger.log(
        `✅ Conversion completed successfully. Generated instruction with ${instructionSteps.length} steps.`,
      );

      return result;
    } catch (error) {
      this.logger.error(`❌ Conversion failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Извлекает конфигурацию триггера из Flow
   */
  private extractTriggerConfig(flow: Flow): {
    type: string;
    columnName: string;
    columnId: string;
    event: string;
    conditions?: any;
  } {
    // Проверяем triggers в definition
    if (flow.definition.triggers && flow.definition.triggers.length > 0) {
      const firstTrigger = flow.definition.triggers[0];
      const columnName =
        firstTrigger.config?.targetColumn ||
        firstTrigger.config?.columnName ||
        'Default Column';
      return {
        type: firstTrigger.type || 'board_move',
        columnName,
        columnId: columnName, // Используем имя колонки как ID
        event: 'on_enter', // По умолчанию
        conditions: firstTrigger.config?.conditions,
      };
    }

    // Проверяем trigger блоки
    const triggerBlock = flow.definition.blocks.find(
      (b) => b.type === 'trigger',
    );
    if (triggerBlock) {
      const columnName =
        (triggerBlock.config as any)?.targetColumn ||
        (triggerBlock.config as any)?.columnName ||
        'Default Column';
      return {
        type: triggerBlock.blockType || 'board_move',
        columnName,
        columnId: columnName, // Используем имя колонки как ID
        event: 'on_enter', // По умолчанию
        conditions: (triggerBlock.config as any)?.conditions,
      };
    }

    // Fallback - используем название flow
    this.logger.warn('No trigger found, using default configuration');
    return {
      type: 'board_move',
      columnName: 'Default Column',
      columnId: 'all',
      event: 'on_enter',
    };
  }

  /**
   * Конвертирует блоки в instructions с учетом порядка выполнения
   */
  private async convertBlocksToInstructions(
    flow: Flow,
    analysisResult: FlowAnalysisResult,
  ): Promise<string[]> {
    const instructions: string[] = [];
    const { executionOrder, conditionalBranches } =
      analysisResult.executionGraph;

    // Получаем блоки в правильном порядке
    const orderedBlocks = (executionOrder || [])
      .map((blockId) => flow.definition.blocks.find((b) => b.id === blockId))
      .filter((block) => block !== undefined);

    let stepNumber = 1;

    for (const block of orderedBlocks) {
      if (!block) continue;

      // Пропускаем trigger блоки (они уже обработаны)
      if (block.type === 'trigger') {
        continue;
      }

      try {
        // Конвертируем блок
        const converted: ConvertedBlock =
          await this.blockConverter.convertBlock(block, stepNumber);

        // Добавляем instruction
        instructions.push(converted.instruction);

        // Если блок имеет условные ветвления, добавляем комментарии
        if (conditionalBranches && conditionalBranches[block.id]) {
          const branches = conditionalBranches[block.id];

          if (branches.trueBranch && branches.trueBranch.length > 0) {
            instructions.push(
              `   → If TRUE: continue to blocks [${branches.trueBranch.join(', ')}]`,
            );
          }

          if (branches.falseBranch && branches.falseBranch.length > 0) {
            instructions.push(
              `   → If FALSE: continue to blocks [${branches.falseBranch.join(', ')}]`,
            );
          }

          if (branches.errorBranch && branches.errorBranch.length > 0) {
            instructions.push(
              `   → On ERROR: continue to blocks [${branches.errorBranch.join(', ')}]`,
            );
          }
        }

        stepNumber++;
      } catch (error) {
        this.logger.error(
          `Failed to convert block ${block.id}: ${error.message}`,
        );
        instructions.push(
          `${stepNumber}. [Error converting block: ${block.name}]`,
        );
        stepNumber++;
      }
    }

    // Добавляем финальное сообщение
    if (instructions.length > 0) {
      instructions.push('');
      instructions.push('✅ Complete all steps in order.');
    }

    return instructions;
  }

  /**
   * Формирует полную инструкцию для AI, описывающую весь Flow:
   * - КОГДА срабатывает (trigger)
   * - ЧТО делать (actions в правильном порядке)
   * - КАК обрабатывать условия (IF/ELSE ветвления)
   * - КАК обрабатывать ошибки
   */
  private buildFullInstruction(
    triggerConfig: {
      type: string;
      columnName: string;
      columnId: string;
      event: string;
      conditions?: any;
    },
    actionSteps: string[],
  ): string {
    const parts: string[] = [];

    // 1. Описание триггера - КОГДА срабатывает
    parts.push('📋 TRIGGER:');
    parts.push(
      `When a task is moved to column "${triggerConfig.columnName}" (event: ${triggerConfig.event})`,
    );
    parts.push('');

    // 2. Вся логика Flow - ЧТО делать
    if (actionSteps.length > 0) {
      parts.push('🎯 EXECUTE THE FOLLOWING LOGIC:');
      parts.push(...actionSteps);
    } else {
      parts.push('⚠️  No actions defined for this flow.');
    }

    return parts.join('\n');
  }

  /**
   * Валидирует Flow перед конвертацией
   */
  async validateFlowForConversion(flow: Flow): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Проверка наличия блоков
    if (!flow.definition?.blocks || flow.definition.blocks.length === 0) {
      errors.push('Flow must have at least one block');
    }

    // Проверка наличия trigger
    const hasTrigger =
      flow.definition?.triggers?.length > 0 ||
      flow.definition?.blocks?.some((b) => b.type === 'trigger');

    if (!hasTrigger) {
      errors.push('Flow must have at least one trigger');
    }

    // Проверка наличия action блоков
    const hasActions = flow.definition?.blocks?.some(
      (b) => b.type === 'action',
    );
    if (!hasActions) {
      warnings.push('Flow has no action blocks - agent may not do anything');
    }

    // Проверка connections
    const connections =
      flow.definition?.connections || flow.definition?.edges || [];
    if (connections.length === 0 && flow.definition.blocks.length > 1) {
      warnings.push(
        'Flow has multiple blocks but no connections - execution order may be unclear',
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
