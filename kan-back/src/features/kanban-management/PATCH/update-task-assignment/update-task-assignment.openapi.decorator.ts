import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UpdateTaskAssignmentRequestDto } from './update-task-assignment.request.dto';
import { UpdateTaskAssignmentResponseDto } from './update-task-assignment.response.dto';

export function UpdateTaskAssignmentOpenApi() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update task assignment',
      description:
        'Updates task assignment including assignee, watchers, and assignment details with notification support',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the task to update assignment for',
      example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    ApiBody({
      type: UpdateTaskAssignmentRequestDto,
      description: 'Assignment update parameters',
      examples: {
        reassign: {
          summary: 'Reassign Task',
          description: 'Reassign task to different user',
          value: {
            action: 'reassign',
            assignee: 'agent-002',
            assignmentReason:
              'Reassigning to team member with more relevant expertise',
            notifyAssignees: true,
            updatedBy: 'agent-001',
          },
        },
        addWatchers: {
          summary: 'Add Watchers',
          description: 'Add watchers to track task progress',
          value: {
            action: 'add_watcher',
            watchers: ['agent-003', 'agent-004', 'agent-005'],
            assignmentReason: 'Adding stakeholders to watch progress',
            notifyAssignees: true,
            updatedBy: 'agent-001',
          },
        },
        detailedAssignment: {
          summary: 'Detailed Assignment',
          description: 'Assign with detailed role and timeline information',
          value: {
            action: 'assign',
            assignee: 'agent-002',
            watchers: ['agent-003', 'agent-004'],
            assignmentDetails: [
              {
                userId: 'agent-002',
                role: 'primary_assignee',
                startDate: '2024-01-15T09:00:00Z',
                endDate: '2024-01-20T17:00:00Z',
              },
              {
                userId: 'agent-003',
                role: 'reviewer',
                startDate: '2024-01-19T09:00:00Z',
                endDate: '2024-01-20T17:00:00Z',
              },
            ],
            assignmentPriority: 'high',
            assignmentReason: 'Critical feature for upcoming release',
            notifyAssignees: true,
            updatedBy: 'agent-001',
          },
        },
        unassign: {
          summary: 'Unassign Task',
          description: 'Remove current assignee from task',
          value: {
            action: 'unassign',
            assignmentReason: 'Task on hold pending requirements clarification',
            notifyAssignees: true,
            updatedBy: 'agent-001',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Task assignment updated successfully',
      type: UpdateTaskAssignmentResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid assignment action or missing required fields',
      schema: {
        example: {
          statusCode: 400,
          message: 'Assignee is required for assign action',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      schema: {
        example: {
          statusCode: 404,
          message:
            'Task with ID a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a not found',
          error: 'Not Found',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during assignment update',
      schema: {
        example: {
          statusCode: 500,
          message: 'Failed to update task assignment',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
