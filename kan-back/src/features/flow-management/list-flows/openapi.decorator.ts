import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ListFlowsResponseDto } from './list-flows.response.dto';
import { FlowStatus } from '../../../entities/flow.entity';

export const ApiListFlows = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List flows with filtering and pagination',
      description:
        'Retrieves a paginated list of flows with optional filtering by status, creator, agent, search terms, and metadata',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of flows per page (1-100)',
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (1-based)',
      example: 1,
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: FlowStatus,
      description: 'Filter by flow status',
    }),
    ApiQuery({
      name: 'createdBy',
      required: false,
      description: 'Filter by creator user ID',
    }),
    ApiQuery({
      name: 'agentId',
      required: false,
      description: 'Filter by associated agent ID',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search in flow names and descriptions',
    }),
    ApiQuery({
      name: 'isTemplate',
      required: false,
      type: Boolean,
      description: 'Filter by template status',
    }),
    ApiQuery({
      name: 'category',
      required: false,
      description: 'Filter by flow category',
    }),
    ApiOkResponse({
      description: 'Flows retrieved successfully',
      type: ListFlowsResponseDto,
    }),
  );
