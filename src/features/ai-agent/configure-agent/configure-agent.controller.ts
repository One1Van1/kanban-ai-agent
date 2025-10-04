import { Controller, Put, Param, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigureAgentService } from './configure-agent.service';
import { ConfigureAgentRequestDto } from './configure-agent.request.dto';
import { ConfigureAgentResponseDto } from './configure-agent.response.dto';
import { ApiConfigureAgent } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('ConfigureAgent')
export class ConfigureAgentController {
  private readonly logger = new Logger(ConfigureAgentController.name);

  constructor(private readonly configureAgentService: ConfigureAgentService) {}

  @Put(':agentId/configure')
  @ApiConfigureAgent()
  async handle(
    @Param('agentId') agentId: string,
    @Body() requestDto: ConfigureAgentRequestDto,
  ): Promise<ConfigureAgentResponseDto> {
    this.logger.log(`Received request to configure AI agent: ${agentId}`);
    return this.configureAgentService.execute(agentId, requestDto);
  }
}
