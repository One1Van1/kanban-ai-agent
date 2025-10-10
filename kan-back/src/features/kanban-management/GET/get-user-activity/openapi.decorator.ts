import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetUserActivityResponseDto } from './get-user-activity.response.dto';

export const ApiGetUserActivity = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user activity history',
      description: 'Retrieves paginated history of user activities on tasks',
    }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of activities per page',
      example: 20,
    }),
    ApiQuery({
      name: 'type',
      required: false,
      description: 'Filter by activity type',
      example: 'status_changed',
    }),
    ApiOkResponse({
      type: GetUserActivityResponseDto,
      description: 'User activity retrieved successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
    }),
  );
