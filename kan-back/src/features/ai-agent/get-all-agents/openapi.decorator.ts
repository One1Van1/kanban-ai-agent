import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { GetAllAgentsResponseDto } from './get-all-agents.response.dto';

export const ApiGetAllAgents = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all agents',
      description: 'Retrieve a list of all AI agents with basic information',
    }),
    ApiOkResponse({
      description: 'List of agents retrieved successfully',
      type: GetAllAgentsResponseDto,
    }),
  );
