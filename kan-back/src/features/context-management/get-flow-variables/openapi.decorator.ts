import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetFlowVariablesResponseDto } from './get-flow-variables.response.dto';
import { VariableType, VariableScope } from './get-flow-variables.query.dto';

export const ApiGetFlowVariables = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get flow variables',
      description:
        'Retrieve variables from a specific flow execution with filtering and search capabilities',
    }),
    ApiParam({
      name: 'flowId',
      description: 'Flow execution ID to get variables from',
      example: 'flow_exec_123',
      type: String,
    }),
    ApiQuery({
      name: 'type',
      required: false,
      enum: VariableType,
      enumName: 'VariableType',
      description: 'Filter variables by type',
      example: VariableType.STRING,
    }),
    ApiQuery({
      name: 'scope',
      required: false,
      enum: VariableScope,
      enumName: 'VariableScope',
      description: 'Filter variables by scope',
      example: VariableScope.GLOBAL,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search variables by name or description (partial match)',
      example: 'user',
    }),
    ApiQuery({
      name: 'hasValue',
      required: false,
      type: Boolean,
      description:
        'Include only variables with values (exclude undefined/null)',
      example: true,
    }),
    ApiQuery({
      name: 'includeSystem',
      required: false,
      type: Boolean,
      description: 'Include system/internal variables in response',
      example: false,
    }),
    ApiOkResponse({
      description: 'Flow variables retrieved successfully',
      type: GetFlowVariablesResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
      schema: {
        example: {
          statusCode: 400,
          message: 'Flow ID is required',
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
