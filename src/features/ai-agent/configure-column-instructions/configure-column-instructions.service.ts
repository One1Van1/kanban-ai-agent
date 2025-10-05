import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

@Injectable()
export class ConfigureColumnInstructionsService {
  private readonly logger = new Logger(ConfigureColumnInstructionsService.name);
  private readonly columnInstructions = new Map<
    string,
    AgentColumnInstruction
  >();

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

      const columnInstruction: AgentColumnInstruction = {
        id: randomUUID(),
        agentId: request.agentId,
        boardId: request.boardId,
        columnId: request.columnId,
        columnName: request.columnName,
        instructions: request.instructions,
        triggerConditions: request.triggerConditions?.map((condition) => ({
          type: condition.type as any,
          value: condition.value,
          operator: condition.operator as any,
        })),
        isActive: request.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store column instruction (in real implementation this would go to database)
      this.columnInstructions.set(instructionKey, columnInstruction);

      this.logger.log(
        `Column instructions configured successfully: ${columnInstruction.id}`,
      );

      // Prepare response
      const triggerConditionsResponse =
        columnInstruction.triggerConditions?.map(
          (condition) =>
            new AgentTriggerConditionResponseDto({
              type: condition.type as TriggerConditionType,
              value: condition.value,
              operator: condition.operator as TriggerOperator,
            }),
        );

      const responseDto = new AgentColumnInstructionResponseDto({
        id: columnInstruction.id,
        agentId: columnInstruction.agentId,
        boardId: columnInstruction.boardId,
        columnId: columnInstruction.columnId,
        columnName: columnInstruction.columnName,
        instructions: columnInstruction.instructions,
        triggerConditions: triggerConditionsResponse,
        isActive: columnInstruction.isActive,
        createdAt: columnInstruction.createdAt,
        updatedAt: columnInstruction.updatedAt,
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
    const instructions: AgentColumnInstruction[] = [];
    for (const [key, instruction] of this.columnInstructions) {
      if (key.startsWith(`${agentId}:`)) {
        instructions.push(instruction);
      }
    }
    return instructions;
  }

  async getColumnInstruction(
    agentId: string,
    boardId: string,
    columnId: string,
  ): Promise<AgentColumnInstruction | null> {
    const key = `${agentId}:${boardId}:${columnId}`;
    return this.columnInstructions.get(key) || null;
  }
}
