import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
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
    // TODO: Реализовать новую логику конвертации flow в agent
    throw new BadRequestException(
      'Конвертация flow в agent временно отключена. Будет переделана.',
    );
  }

  // TODO: Новые методы конвертации будут добавлены здесь
}
