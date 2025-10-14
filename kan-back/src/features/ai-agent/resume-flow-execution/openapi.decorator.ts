import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResumeFlowExecutionResponseDto } from './resume-flow-execution.response.dto';

export const ApiResumeFlowExecution = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Resume paused flow execution',
      description:
        'Resumes a previously paused flow execution. Only executions in PAUSED status can be resumed. The execution state and context must be preserved for successful resume.',
    }),
    ApiParam({
      name: 'executionId',
      description: 'Unique identifier of the flow execution to resume',
      type: String,
      example: 'exec-001',
    }),
    ApiOkResponse({
      description: 'Flow execution successfully resumed',
      type: ResumeFlowExecutionResponseDto,
      example: {
        executionId: 'exec-001',
        flowId: 'flow-001',
        status: 'RUNNING',
        resumedAt: '2024-01-15T10:10:15Z',
        pausedDuration: 285,
        currentStep: 3,
        totalSteps: 8,
        progress: 37.5,
        message: 'Flow execution has been successfully resumed',
        restoredContext: {
          variablesRestored: 3,
          checkpointRestored: 'after_user_input_validation',
          stateValidated: true,
        },
        nextStepInfo: {
          nextStepNumber: 4,
          nextStepName: 'Step 4: Continue processing',
          estimatedDuration: 120,
          stepsRemaining: 5,
        },
        resumeSuccessful: true,
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
        'Cannot resume flow execution (wrong status, context lost, or state corrupted)',
      example: {
        statusCode: 400,
        message:
          'Cannot resume flow execution. Current status: RUNNING. Only PAUSED executions can be resumed.',
        error: 'Bad Request',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during resume operation',
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    }),
  );
