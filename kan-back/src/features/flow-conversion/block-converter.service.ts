import { Injectable, Logger } from '@nestjs/common';
import {
  FlowBlockData,
  TriggerBlockData,
  ActionBlockData,
  LogicBlockData,
  ContextBlockData,
  WaitBlockData,
} from '../../types/flow-definition.types';

/**
 * Результат конвертации блока
 */
export interface ConvertedBlock {
  blockId: string;
  instructionType: 'trigger' | 'action' | 'condition' | 'context' | 'wait';
  instruction: string;
  metadata: {
    originalBlockType: string;
    hasConditions: boolean;
    requiresResponse?: boolean;
  };
}

/**
 * Сервис для конвертации блоков Flow в Agent instructions
 */
@Injectable()
export class BlockConverterService {
  private readonly logger = new Logger(BlockConverterService.name);

  /**
   * Конвертирует блок в instruction
   */
  async convertBlock(
    block: FlowBlockData,
    stepNumber: number,
  ): Promise<ConvertedBlock> {
    this.logger.debug(
      `Converting block ${block.id} (type: ${block.blockType})`,
    );

    const blockType = block.type;

    if (blockType === 'trigger') {
      return this.convertTriggerBlock(block as TriggerBlockData, stepNumber);
    } else if (blockType === 'action') {
      return this.convertActionBlock(block as ActionBlockData, stepNumber);
    } else if (blockType === 'logic') {
      return this.convertLogicBlock(block as LogicBlockData, stepNumber);
    } else if (blockType === 'context') {
      return this.convertContextBlock(block as ContextBlockData, stepNumber);
    } else if (blockType === 'wait') {
      return this.convertWaitBlock(block as WaitBlockData, stepNumber);
    }

    throw new Error(`Unknown block type: ${blockType}`);
  }

  /**
   * Конвертирует Trigger блок
   */
  private convertTriggerBlock(
    block: TriggerBlockData,
    stepNumber: number,
  ): ConvertedBlock {
    let instruction = '';

    switch (block.blockType) {
      case 'board_move':
        instruction = `When a card is moved to column "${block.config.targetColumn || block.config.columnName}"`;
        if (block.config.sourceColumn) {
          instruction += ` from "${block.config.sourceColumn}"`;
        }
        break;

      case 'board_create':
        instruction = `When a new card is created`;
        if (block.config.targetColumn) {
          instruction += ` in column "${block.config.targetColumn}"`;
        }
        break;

      case 'board_update':
        instruction = `When a card is updated`;
        if (block.config.targetColumn) {
          instruction += ` in column "${block.config.targetColumn}"`;
        }
        break;

      case 'webhook':
        instruction = `When webhook is triggered at ${block.config.webhookUrl}`;
        break;

      case 'time_based':
        instruction = `On schedule: ${block.config.schedule?.expression}`;
        break;

      default:
        instruction = `Trigger: ${block.name}`;
    }

    return {
      blockId: block.id,
      instructionType: 'trigger',
      instruction,
      metadata: {
        originalBlockType: block.blockType,
        hasConditions: !!block.config.conditions,
      },
    };
  }

  /**
   * Конвертирует Action блок
   */
  private convertActionBlock(
    block: ActionBlockData,
    stepNumber: number,
  ): ConvertedBlock {
    let instruction = `${stepNumber}. `;

    switch (block.blockType) {
      case 'comment':
        instruction += `Add comment: "${block.config.commentText || block.config.message}"`;
        break;

      case 'ai_request':
        instruction += `Send AI request to ${block.config.aiModel || 'AI'}`;
        if (block.config.prompt) {
          instruction += `: "${block.config.prompt}"`;
        }
        if (block.config.attachments && block.config.attachments.length > 0) {
          instruction += `. Include attachments: ${block.config.attachments.join(', ')}`;
        }
        break;

      case 'create_file':
        instruction += `Create file "${block.config.fileName}" (${block.config.fileFormat || 'txt'})`;
        break;

      case 'attach_file':
        instruction += `Attach file "${block.config.fileName}" to card`;
        break;

      case 'send_notification':
        instruction += `Send notification to ${block.config.recipient}`;
        if (block.config.channel) {
          instruction += ` via ${block.config.channel}`;
        }
        if (block.config.message) {
          instruction += `: "${block.config.message}"`;
        }
        break;

      case 'update_card':
        instruction += `Update card field "${block.config.field}" to "${block.config.value}"`;
        break;

      case 'move_card':
        instruction += `Move card to column "${block.config.targetColumn}"`;
        break;

      default:
        instruction += `Action: ${block.name}`;
    }

    return {
      blockId: block.id,
      instructionType: 'action',
      instruction,
      metadata: {
        originalBlockType: block.blockType,
        hasConditions: false,
        requiresResponse: block.blockType === 'ai_request',
      },
    };
  }

  /**
   * Конвертирует Logic блок
   */
  private convertLogicBlock(
    block: LogicBlockData,
    stepNumber: number,
  ): ConvertedBlock {
    let instruction = `${stepNumber}. `;

    switch (block.blockType) {
      case 'if_else':
        if (block.config.condition) {
          const { variable, operator, value } = block.config.condition;
          instruction += `If ${variable} ${this.operatorToText(operator)} ${value ? `"${value}"` : 'empty'}`;
        } else {
          instruction += `If condition met`;
        }
        break;

      case 'switch':
        instruction += `Switch based on ${block.config.condition?.variable}`;
        break;

      case 'loop':
        instruction += `Loop through ${block.config.condition?.variable}`;
        break;

      case 'try_catch':
        instruction += `Try to execute, catch errors`;
        break;

      case 'ai_result':
        instruction += `Check AI response in ${block.config.responseVariable}`;
        break;

      default:
        instruction += `Logic: ${block.name}`;
    }

    return {
      blockId: block.id,
      instructionType: 'condition',
      instruction,
      metadata: {
        originalBlockType: block.blockType,
        hasConditions: true,
      },
    };
  }

  /**
   * Конвертирует Context блок
   */
  private convertContextBlock(
    block: ContextBlockData,
    stepNumber: number,
  ): ConvertedBlock {
    let instruction = `${stepNumber}. `;

    switch (block.blockType) {
      case 'extract_files':
        instruction += `Extract files from card attachments`;
        if (block.config.filter?.fileType) {
          instruction += ` (types: ${block.config.filter.fileType.join(', ')})`;
        }
        if (block.config.variableName) {
          instruction += `. Store in: ${block.config.variableName}`;
        }
        break;

      case 'get_card_data':
        instruction += `Get card data`;
        if (block.config.variableName) {
          instruction += ` and store in: ${block.config.variableName}`;
        }
        break;

      case 'external_api':
        instruction += `Call external API`;
        if (block.config.variableName) {
          instruction += `. Store response in: ${block.config.variableName}`;
        }
        break;

      case 'variable':
        instruction += `Get variable: ${block.config.variableName}`;
        break;

      default:
        instruction += `Context: ${block.name}`;
    }

    return {
      blockId: block.id,
      instructionType: 'context',
      instruction,
      metadata: {
        originalBlockType: block.blockType,
        hasConditions: false,
      },
    };
  }

  /**
   * Конвертирует Wait блок
   */
  private convertWaitBlock(
    block: WaitBlockData,
    stepNumber: number,
  ): ConvertedBlock {
    let instruction = `${stepNumber}. `;

    switch (block.blockType) {
      case 'wait_response':
        instruction += `Wait for ${block.config.waitFor || 'response'}`;
        if (block.config.timeout) {
          instruction += ` (timeout: ${block.config.timeout}ms)`;
        }
        break;

      case 'wait_time':
        instruction += `Wait for ${block.config.timeout || 1000}ms`;
        break;

      case 'wait_condition':
        instruction += `Wait until condition is met`;
        if (block.config.timeout) {
          instruction += ` (timeout: ${block.config.timeout}ms)`;
        }
        break;

      default:
        instruction += `Wait: ${block.name}`;
    }

    return {
      blockId: block.id,
      instructionType: 'wait',
      instruction,
      metadata: {
        originalBlockType: block.blockType,
        hasConditions: false,
      },
    };
  }

  /**
   * Конвертирует оператор в текст
   */
  private operatorToText(
    operator: 'exists' | 'empty' | 'equals' | 'contains' | 'greater' | 'less',
  ): string {
    const operators = {
      exists: 'exists',
      empty: 'is empty',
      equals: 'equals',
      contains: 'contains',
      greater: 'is greater than',
      less: 'is less than',
    };

    return operators[operator] || operator;
  }
}
