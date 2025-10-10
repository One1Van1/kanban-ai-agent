import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';

export const ApiCacheAgentConfigs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cache agent configuration data',
      description:
        'Stores agent configuration in Redis cache with configurable TTL for fast access during AI processing',
    }),
    ApiCreatedResponse({
      description: 'Agent configuration cached successfully',
      type: CacheAgentConfigsResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid agent configuration data',
    }),
  );
