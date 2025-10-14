import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { PauseFlowExecutionResponseDto } from './pause-flow-execution.response.dto';

export const ApiPauseFlowExecution = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Pause flow execution',
      description:
        'Pauses a currently running flow execution. Only executions in RUNNING status can be paused. Some atomic steps cannot be interrupted and will need to complete before pausing.',
    }),
    ApiParam({
      name: 'executionId',
      description: 'Unique identifier of the flow execution to pause',
      type: String,
      example: 'exec-001',
    }),
    ApiOkResponse({
      description: 'Flow execution successfully paused',
      type: PauseFlowExecutionResponseDto,
      example: {
        executionId: 'exec-001',
        flowId: 'flow-001',
        status: 'PAUSED',
        pausedAt: '2024-01-15T10:05:30Z',
        pauseReason: 'Paused by user request',
        currentStep: 3,
        totalSteps: 8,
        progress: 37.5,
        message: 'Flow execution has been successfully paused',
        canBeResumed: true,
        estimatedResumeTime: null,
        nextAction: 'Use resume-flow-execution endpoint to continue',
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
        'Cannot pause flow execution (wrong status or non-pausable step)',
      example: {
        statusCode: 400,
        message:
          'Cannot pause flow execution. Current status: COMPLETED. Only RUNNING executions can be paused.',
        error: 'Bad Request',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during pause operation',
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    }),
  );
