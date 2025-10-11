import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { BoardType } from '../../../types/board-integration.interface';
import { GetAgentsByBoardTypeResponseDto } from './get-agents-by-board-type.response.dto';

export const ApiGetAgentsByBoardType = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get agents by board type',
      description:
        'Retrieve all AI agents associated with a specific board type (Jira, Trello, etc.)',
    }),
    ApiParam({
      name: 'boardType',
      description: 'Board type to filter agents',
      enum: BoardType,
      enumName: 'BoardType',
      example: BoardType.JIRA,
    }),
    ApiOkResponse({
      description: 'Agents for the specified board type retrieved successfully',
      type: GetAgentsByBoardTypeResponseDto,
    }),
  );
