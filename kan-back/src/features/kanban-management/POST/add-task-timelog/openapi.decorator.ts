import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';

export const ApiAddTaskTimelog = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Add timelog entry to task',
      description:
        'Creates a new timelog entry for tracking time spent on a specific task',
    }),
    ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiCreatedResponse({
      type: AddTaskTimelogResponseDto,
      description: 'Timelog entry created successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data or time validation failed',
    }),
  );
