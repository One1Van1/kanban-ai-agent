import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { StoreAgentConfigResponseDto } from './store-agent-config.response.dto';

export const ApiStoreAgentConfig = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Store or update agent configuration in database',
      description:
        'Creates a new agent or updates existing agent configuration with instructions in the database',
    }),
    ApiOkResponse({
      type: StoreAgentConfigResponseDto,
      description: 'Agent configuration stored successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data',
    }),
    ApiNotFoundResponse({
      description: 'Agent not found (when updating existing agent)',
    }),
  );
