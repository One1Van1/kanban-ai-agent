import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetFlowExecutionStatusResponseDto } from './get-flow-execution-status.response.dto';

export const ApiGetFlowExecutionStatus = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get flow execution status',
      description:
        'Retrieve detailed status information about a specific flow execution including progress, steps, logs, and metrics',
    }),
    ApiParam({
      name: 'executionId',
      description: 'Flow execution ID to get status for',
      example: 'flow_exec_123',
      type: String,
    }),
    ApiQuery({
      name: 'includeSteps',
      required: false,
      type: Boolean,
      description: 'Include detailed step information in response',
      example: true,
    }),
    ApiQuery({
      name: 'includeLogs',
      required: false,
      type: Boolean,
      description: 'Include execution logs in response',
      example: true,
    }),
    ApiQuery({
      name: 'includeVariables',
      required: false,
      type: Boolean,
      description: 'Include variable values in response',
      example: false,
    }),
    ApiQuery({
      name: 'includeMetrics',
      required: false,
      type: Boolean,
      description: 'Include performance metrics in response',
      example: true,
    }),
    ApiOkResponse({
      description: 'Flow execution status retrieved successfully',
      type: GetFlowExecutionStatusResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
      schema: {
        example: {
          statusCode: 400,
          message: 'Execution ID is required',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Flow execution not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Flow execution with ID flow_exec_123 not found',
          error: 'Not Found',
        },
      },
    }),
  );
