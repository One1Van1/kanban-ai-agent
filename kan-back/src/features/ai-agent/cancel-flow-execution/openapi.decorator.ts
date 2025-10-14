import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CancelFlowExecutionResponseDto } from './cancel-flow-execution.response.dto';

export const ApiCancelFlowExecution = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cancel flow execution',
      description:
        'Cancels a running or paused flow execution. Performs cleanup of resources, terminates connections, and optionally performs rollback operations. Use force=true to override safety checks.',
    }),
    ApiParam({
      name: 'executionId',
      description: 'Unique identifier of the flow execution to cancel',
      type: String,
      example: 'exec-001',
    }),
    ApiQuery({
      name: 'force',
      description:
        "Force cancellation even if it's not safe (may cause side effects)",
      type: Boolean,
      required: false,
      example: false,
    }),
    ApiOkResponse({
      description: 'Flow execution successfully cancelled',
      type: CancelFlowExecutionResponseDto,
      example: {
        executionId: 'exec-001',
        flowId: 'flow-001',
        status: 'CANCELLED',
        cancelledAt: '2024-01-15T10:15:45Z',
        cancelReason: 'Cancelled by user',
        wasForced: false,
        currentStep: 3,
        totalSteps: 8,
        progress: 37.5,
        message: 'Flow execution has been successfully cancelled',
        cleanupResult: {
          cleanupSteps: [
            'Terminated 2 active connections: jira-api, database',
            'Freed 2 resources: temp-file-001.json, api-session-abc123',
          ],
          cleanupDuration: 150,
          cleanupSuccessful: true,
          warningsGenerated: [],
          resourcesRecovered: 2,
          connectionsTerminated: 2,
        },
        rollbackPerformed: false,
        resourcesFreed: 2,
        connectionsTerminated: 2,
      },
    }),
    ApiNotFoundResponse({
      description: 'Flow execution not found',
      example: {
        statusCode: 404,
        message: 'Flow execution with ID exec-999 not found',
        error: 'Not Found',
      },
    }),
    ApiBadRequestResponse({
      description:
        'Cannot cancel flow execution (wrong status, already completed, or unsafe to cancel)',
      example: {
        statusCode: 400,
        message:
          'Cannot cancel flow execution. Execution has already completed successfully.',
        error: 'Bad Request',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during cancellation operation',
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    }),
  );
