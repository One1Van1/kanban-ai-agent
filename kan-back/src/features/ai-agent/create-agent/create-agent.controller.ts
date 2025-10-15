import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
        createdAgent: agent,
        createdInstructions: instructions,
        flowId: flowDefinition?.id || 'generated',
      };
    } catch (error) {
      this.logger.error(`❌ Failed to save Flow: ${error.message}`);
      throw error;
    }
  }

  private generateAgentInstructions(blocks: any[] = []): string {
    const instructions = [
      'Ты - AI агент для автоматического выполнения задач в Kanban досках.',
    ];

    if (!Array.isArray(blocks)) {
      this.logger.warn('Blocks is not an array, using empty array');
      blocks = [];
    }

    for (const block of blocks) {
      switch (block.type) {
        case 'extract_files':
          instructions.push(
            '- Извлекай и анализируй прикрепленные файлы из задач',
          );
          break;
        case 'ai_request':
          instructions.push(
            '- Выполняй AI анализ с использованием предоставленных промптов',
          );
          break;
        case 'comment':
          instructions.push(
            '- Добавляй комментарии к задачам с результатами анализа',
          );
          break;
      }
    }

    return instructions.join('\n');
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
          break;
        case 'ai_request':
          steps.push(`${index + 1}. Выполни AI анализ`);
          if (block.config.prompt) {
            steps.push(`   - Промпт: "${block.config.prompt}"`);
          }
          break;
        case 'comment':
          steps.push(`${index + 1}. Добавь комментарий с результатами`);
          break;
      }
    });

    return steps.join('\n');
  }
}
