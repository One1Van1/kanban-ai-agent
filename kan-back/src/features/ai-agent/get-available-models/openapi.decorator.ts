import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAvailableModelsResponseDto } from './get-available-models.response.dto';

export const ApiGetAvailableModels = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get available AI models',
      description:
        'Retrieves a list of all AI models available for use in the Flow Builder, including their capabilities, pricing, and availability status',
    }),
    ApiResponse({
      status: 200,
      description: 'Available AI models retrieved successfully',
      type: GetAvailableModelsResponseDto,
    }),
  );
