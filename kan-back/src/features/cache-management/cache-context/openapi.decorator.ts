import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CacheContextResponseDto } from './cache-context.response.dto';

export const ApiCacheContext = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cache context data for AI agent processing',
      description:
        'Stores context data in Redis cache with configurable TTL for efficient retrieval during AI agent processing',
    }),
    ApiCreatedResponse({
      description: 'Context cached successfully',
      type: CacheContextResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data',
    }),
  );
