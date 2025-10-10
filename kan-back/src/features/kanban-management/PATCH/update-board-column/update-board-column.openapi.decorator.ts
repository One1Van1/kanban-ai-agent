import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UpdateBoardColumnRequestDto } from './update-board-column.request.dto';
import { UpdateBoardColumnResponseDto } from './update-board-column.response.dto';

export function UpdateBoardColumnOpenApi() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update board column',
      description:
        'Updates board column properties like name, position, WIP limit, color, etc. with change tracking',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the column to update',
      example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    ApiBody({
      type: UpdateBoardColumnRequestDto,
      description: 'Column update parameters',
      examples: {
        nameAndColor: {
          summary: 'Update Name and Color',
          description: 'Update column name and visual appearance',
          value: {
            name: 'Ready for QA Testing',
            color: '#2196F3',
            description: 'Tasks that are ready for quality assurance testing',
            updatedBy: 'agent-001',
            updateComment: 'Renamed column for clarity and updated color',
          },
        },
        wipLimitUpdate: {
          summary: 'Update WIP Limit',
          description: 'Adjust work-in-progress limit for better flow',
          value: {
            wipLimit: 8,
            updatedBy: 'agent-001',
            updateComment: 'Increased WIP limit to accommodate team growth',
          },
        },
        positionChange: {
          summary: 'Change Position',
          description: 'Move column to different position in board',
          value: {
            position: 3,
            updatedBy: 'agent-001',
            updateComment: 'Moved column to better reflect workflow order',
          },
        },
        deactivateColumn: {
          summary: 'Deactivate Column',
          description: 'Temporarily disable column without deleting',
          value: {
            isActive: false,
            updatedBy: 'agent-001',
            updateComment:
              'Temporarily disabling column during workflow restructure',
          },
        },
        comprehensiveUpdate: {
          summary: 'Comprehensive Update',
          description: 'Update multiple column properties',
          value: {
            name: 'Quality Assurance',
            type: 'custom',
            description: 'Comprehensive quality assurance and testing phase',
            color: '#9C27B0',
            wipLimit: 5,
            position: 4,
            updatedBy: 'agent-001',
            updateComment: 'Complete column restructure for improved workflow',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Column updated successfully',
      type: UpdateBoardColumnResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data or no fields to update',
      schema: {
        example: {
          statusCode: 400,
          message: 'No fields to update provided',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Column not found',
      schema: {
        example: {
          statusCode: 404,
          message:
            'Column with ID col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a not found',
          error: 'Not Found',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Column with same name already exists',
      schema: {
        example: {
          statusCode: 409,
          message:
            'Column with name "In Progress" already exists in board board-001',
          error: 'Conflict',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during column update',
      schema: {
        example: {
          statusCode: 500,
          message: 'Failed to update board column',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
