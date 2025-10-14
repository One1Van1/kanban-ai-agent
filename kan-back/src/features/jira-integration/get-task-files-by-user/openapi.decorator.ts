import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetTaskFilesByUserResponseDto } from './get-task-files-by-user.response.dto';
import {
  FileType,
  SortBy,
  SortOrder,
} from './get-task-files-by-user.query.dto';

export const ApiGetTaskFilesByUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task files by user',
      description:
        'Retrieve paginated list of files from a specific Jira task filtered by user who uploaded them',
    }),
    ApiParam({
      name: 'taskId',
      description: 'Jira task ID or key (e.g., "PROJ-123")',
      example: 'PROJ-123',
      type: String,
    }),
    ApiParam({
      name: 'userId',
      description: 'User ID, email, or display name to filter files by',
      example: 'john.doe@company.com',
      type: String,
    }),
    ApiQuery({
      name: 'fileType',
      required: false,
      enum: FileType,
      enumName: 'FileType',
      description: 'Filter files by type',
      example: FileType.IMAGE,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of files per page (1-100, default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (starting from 1, default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      enum: SortBy,
      enumName: 'SortBy',
      description: 'Field to sort by (default: createdAt)',
      example: SortBy.CREATED_AT,
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: SortOrder,
      enumName: 'SortOrder',
      description: 'Sort order (default: DESC)',
      example: SortOrder.DESC,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search files by name (partial match)',
      example: 'screenshot',
    }),
    ApiOkResponse({
      description: 'Task files retrieved successfully',
      type: GetTaskFilesByUserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters or Jira configuration error',
      schema: {
        example: {
          statusCode: 400,
          message: 'Task ID and User ID are required',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Task with ID PROJ-123 not found',
          error: 'Not Found',
        },
      },
    }),
  );
