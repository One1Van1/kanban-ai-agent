import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTaskLinkResponseDto } from './create-task-link.response.dto';

export const ApiCreateTaskLink = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a link between tasks',
      description:
        'Creates a relationship link between two tasks (blocks, depends on, relates to, etc.)',
    }),
    ApiParam({
      name: 'id',
      description: 'Source task ID',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiCreatedResponse({
      type: CreateTaskLinkResponseDto,
      description: 'Task link created successfully',
    }),
    ApiBadRequestResponse({
      description:
        'Invalid request data, task linking to itself, or link already exists',
    }),
  );
