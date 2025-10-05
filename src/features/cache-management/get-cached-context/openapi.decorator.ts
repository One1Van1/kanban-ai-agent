import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';

export const ApiGetCachedContext = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve cached context data by key',
      description:
        'Retrieves previously cached context data from Redis using the cache key',
    }),
    ApiParam({
      name: 'key',
      description: 'Cache key to retrieve context data',
      example: 'task-123-context',
    }),
    ApiOkResponse({
      description: 'Context retrieved successfully (or not found)',
      type: GetCachedContextResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Cache key not found',
    }),
  );
