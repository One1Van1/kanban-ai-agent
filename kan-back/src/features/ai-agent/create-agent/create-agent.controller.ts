import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAgentService } from './create-agent.service';
import { CreateAgentRequestDto } from './create-agent.request.dto';
import { CreateAgentResponseDto } from './create-agent.response.dto';
import { ApiCreateAgent } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('CreateAgent')
export class CreateAgentController {
  private readonly logger = new Logger(CreateAgentController.name);

  constructor(private readonly createAgentService: CreateAgentService) {}

  @Post()
  @ApiCreateAgent()
  async handle(
    @Body() requestDto: CreateAgentRequestDto,
  ): Promise<CreateAgentResponseDto> {
    this.logger.log(`Received request to create AI agent: ${requestDto.name}`);
    return this.createAgentService.execute(requestDto);
  }
}
