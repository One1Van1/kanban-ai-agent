import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { StoreTaskHistoryResponseDto } from './store-task-history.response.dto';

export const ApiStoreTaskHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Store task history record',
      description: 'Creates a new task history record in the database',
    }),
    ApiOkResponse({
      type: StoreTaskHistoryResponseDto,
      description: 'Task history stored successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data',
    }),
  );
