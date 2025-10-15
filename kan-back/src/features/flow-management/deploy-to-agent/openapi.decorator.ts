import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { DeployToAgentResponseDto } from './deploy-to-agent.response.dto';

export function ApiDeployToAgent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deploy Flow to Agent',
      description: 'Converts a Flow into an Agent with column instructions',
    }),
    ApiResponse({
      status: 200,
      description: 'Flow successfully deployed to agent',
      type: DeployToAgentResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Flow validation failed or flow is not in deployable state',
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during deployment',
    }),
  );
}
