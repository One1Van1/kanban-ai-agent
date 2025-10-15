import {
  Controller,
  Post,
  Param,
  Body,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeployToAgentService } from './deploy-to-agent.service';
import { DeployToAgentRequestDto } from './deploy-to-agent.request.dto';
import { DeployToAgentResponseDto } from './deploy-to-agent.response.dto';
import { ApiDeployToAgent } from './openapi.decorator';

@Controller('flow-management')
@ApiTags('DeployToAgent')
export class DeployToAgentController {
  private readonly logger = new Logger(DeployToAgentController.name);

  constructor(private readonly deployToAgentService: DeployToAgentService) {}

  @Post(':id/deploy-to-agent')
  @ApiDeployToAgent()
  async handle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDto: DeployToAgentRequestDto,
  ): Promise<DeployToAgentResponseDto> {
    this.logger.log(
      `POST /flow-management/${id}/deploy-to-agent - Deploying flow to agent`,
    );

    const result = await this.deployToAgentService.execute(id, requestDto);

    this.logger.log(`Flow deployed to agent successfully: ${result.agentId}`);
    return result;
  }
}
