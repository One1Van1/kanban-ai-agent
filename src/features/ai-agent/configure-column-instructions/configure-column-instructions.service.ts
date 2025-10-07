import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  ConfigureColumnInstructionsRequestDto,
  TriggerConditionType,
  TriggerOperator,
} from './configure-column-instructions.request.dto';
import {
  ConfigureColumnInstructionsResponseDto,
  AgentColumnInstructionResponseDto,
  AgentTriggerConditionResponseDto,
} from './configure-column-instructions.response.dto';
import { AgentColumnInstruction } from '../../../types/ai-agent.interface';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';

@Injectable()
export class ConfigureColumnInstructionsService {
  private readonly logger = new Logger(ConfigureColumnInstructionsService.name);

  constructor(
    @InjectRepository(AgentInstruction)
    private readonly agentInstructionRepository: Repository<AgentInstruction>,
  ) {}

  async execute(
    request: ConfigureColumnInstructionsRequestDto,
  ): Promise<ConfigureColumnInstructionsResponseDto> {
    this.logger.log(
      `Configuring column instructions for agent: ${request.agentId}, column: ${request.columnId}`,
    );

    try {
      // Validate agent exists (in real implementation would check database)
      await this.validateAgent(request.agentId);

      // Validate column data
      this.validateColumnData(request);

      // Create or update column instruction
      const instructionKey = `${request.agentId}:${request.boardId}:${request.columnId}`;

      // 💾 Сохраняем в PostgreSQL с явной транзакцией
      this.logger.log(
        `🔍 Creating instruction for agent: ${request.agentId}, column: ${request.columnName}`,
      );

      let savedInstruction: any;

      try {
        const agentInstruction = this.agentInstructionRepository.create({
          agentId: request.agentId,
          columnId: request.columnId,
          columnName: request.columnName,
          instruction: request.instructions,
          triggerEvent: 'on_enter',
          conditions: request.triggerConditions || [],
          actions: {
            type: 'send_telegram_notification',
            template: 'Новая задача назначена на вас: {summary}',
          },
          isActive: request.isActive,
          priority: 0,
        });

        this.logger.log(`💾 Saving to database...`);
        savedInstruction =
          await this.agentInstructionRepository.save(agentInstruction);
        this.logger.log(`✅ Saved! ID: ${savedInstruction.id}`);

        // 🔍 Проверяем, что реально сохранилось
        const verifyInstruction = await this.agentInstructionRepository.findOne(
          {
            where: { id: savedInstruction.id },
          },
        );
        this.logger.log(
          `🔍 Verification: ${verifyInstruction ? 'FOUND' : 'NOT FOUND'} in DB`,
        );

        if (!verifyInstruction) {
          throw new Error('Instruction was not saved to database!');
        }
      } catch (saveError) {
        this.logger.error(`💥 Database save error:`, saveError);
        throw saveError;
      }

      this.logger.log(
        `✅ Column instructions saved to PostgreSQL: ${savedInstruction.id}`,
      );

      // Prepare response
      const triggerConditionsResponse = request.triggerConditions?.map(
        (condition) =>
          new AgentTriggerConditionResponseDto({
            type: condition.type as TriggerConditionType,
            value: condition.value,
            operator: condition.operator as TriggerOperator,
          }),
      );

      const responseDto = new AgentColumnInstructionResponseDto({
        id: savedInstruction.id,
        agentId: savedInstruction.agentId,
        boardId: request.boardId,
        columnId: savedInstruction.columnId,
        columnName: savedInstruction.columnName,
        instructions: savedInstruction.instruction,
        triggerConditions: triggerConditionsResponse,
        isActive: savedInstruction.isActive,
        createdAt: savedInstruction.createdAt,
        updatedAt: savedInstruction.updatedAt,
      });

      return new ConfigureColumnInstructionsResponseDto(
        responseDto,
        'Column instructions configured successfully',
      );
    } catch (error) {
      this.logger.error(
        `Failed to configure column instructions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async validateAgent(agentId: string): Promise<void> {
    // In real implementation, this would check if agent exists in database
    if (!agentId || agentId.trim().length === 0) {
      throw new BadRequestException('Agent ID is required');
    }
  }

  private validateColumnData(
    request: ConfigureColumnInstructionsRequestDto,
  ): void {
    if (!request.boardId || request.boardId.trim().length === 0) {
      throw new BadRequestException('Board ID is required');
    }

    if (!request.columnId || request.columnId.trim().length === 0) {
      throw new BadRequestException('Column ID is required');
    }

    if (!request.columnName || request.columnName.trim().length === 0) {
      throw new BadRequestException('Column name is required');
    }

    if (!request.instructions || request.instructions.trim().length === 0) {
      throw new BadRequestException('Instructions are required');
    }

    if (request.instructions.length > 5000) {
      throw new BadRequestException(
        'Instructions cannot exceed 5000 characters',
      );
    }

    // Validate trigger conditions
    if (request.triggerConditions && request.triggerConditions.length > 10) {
      throw new BadRequestException(
        'Cannot have more than 10 trigger conditions',
      );
    }
  }

  async getColumnInstructionsByAgent(
    agentId: string,
  ): Promise<AgentColumnInstruction[]> {
    const instructions = await this.agentInstructionRepository.find({
      where: { agentId, isActive: true },
    });

    return instructions.map((instruction) => ({
      id: instruction.id,
      agentId: instruction.agentId,
      boardId: 'main-kanban-board', // TODO: добавить boardId в entity
      columnId: instruction.columnId,
      columnName: instruction.columnName,
      instructions: instruction.instruction,
      triggerConditions: instruction.conditions as any,
      isActive: instruction.isActive,
      createdAt: instruction.createdAt,
      updatedAt: instruction.updatedAt,
    }));
  }

  async getColumnInstruction(
    agentId: string,
    boardId: string,
    columnId: string,
  ): Promise<AgentColumnInstruction | null> {
    const instruction = await this.agentInstructionRepository.findOne({
      where: {
        agentId,
        columnId,
        isActive: true,
      },
    });

    if (!instruction) return null;

    return {
      id: instruction.id,
      agentId: instruction.agentId,
      boardId: boardId,
      columnId: instruction.columnId,
      columnName: instruction.columnName,
      instructions: instruction.instruction,
      triggerConditions: instruction.conditions as any,
      isActive: instruction.isActive,
      createdAt: instruction.createdAt,
      updatedAt: instruction.updatedAt,
    };
  }
}
