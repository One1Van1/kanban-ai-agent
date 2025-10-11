import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GetAgentByIdResponseDto } from './get-agent-by-id.response.dto';

export const ApiGetAgentById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get agent by ID',
      description:
        'Retrieve detailed information about a specific AI agent by its ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Agent unique identifier',
      example: 'uuid-agent-id',
    }),
    ApiOkResponse({
      description: 'Agent details retrieved successfully',
      type: GetAgentByIdResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Agent not found',
    }),
  );
