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
import { AssignTaskRequestDto } from './assign-task.request.dto';
import { AssignTaskResponseDto } from './assign-task.response.dto';

export function ApiAssignTask() {
  return applyDecorators(
    ApiOperation({
      summary: 'Assign task to a user',
      description: `
        Assigns a task to a specific user by email. This endpoint allows AI agents 
        and system components to assign tasks to team members with optional context 
        and assignment messages.

        **Key Features:**
        - Assigns task to user by email
        - Optional assignment message and context
        - Tracks assignment history in TaskHistory
        - Supports both manual and agent-triggered assignments
        - Maintains task state consistency

        **Assignment Process:**
        1. Validates task exists
        2. Creates assignment record in TaskHistory
        3. Updates task context with assignment info
        4. Returns complete assignment details

        **Use Cases:**
        - AI agent assigning tasks based on expertise
        - Manual task assignment by project manager
        - Automated assignment based on workload
        - Re-assignment of tasks

        **Context Information:**
        The context field can include assignment-specific data like priority,
        department, estimated hours, or any other relevant assignment metadata.
      `,
      tags: ['Kanban Management', 'Task Assignment'],
    }),

    ApiParam({
      name: 'id',
      description: 'Unique identifier of the task to assign',
      example: '550e8400-e29b-41d4-a716-446655440000',
      type: 'string',
    }),

    ApiBody({
      type: AssignTaskRequestDto,
      description:
        'Assignment details including assignee email and optional context',
      examples: {
        basic_assignment: {
          summary: 'Basic task assignment',
          description: 'Simple assignment with just assignee email',
          value: {
            assigneeEmail: 'john.doe@example.com',
            assigneeName: 'John Doe',
            assignedByEmail: 'manager@example.com',
            assignedByName: 'Project Manager',
            triggerType: 'manual',
          },
        },
        agent_assignment: {
          summary: 'AI agent assignment',
          description: 'Assignment performed by AI agent with context',
          value: {
            assigneeEmail: 'expert.dev@example.com',
            assigneeName: 'Expert Developer',
            assignmentMessage:
              'Назначаю эту задачу тебе, так как у тебя больше опыта с этой технологией',
            context: {
              priority: 'high',
              department: 'backend',
              estimatedHours: 8,
              expertise: 'database_optimization',
            },
            agentId: 'uuid-agent-123',
            triggerType: 'agent_instruction',
          },
        },
        reassignment: {
          summary: 'Task reassignment',
          description: 'Reassigning task from one user to another',
          value: {
            assigneeEmail: 'new.dev@example.com',
            assigneeName: 'New Developer',
            assignedByEmail: 'lead@example.com',
            assignedByName: 'Team Lead',
            assignmentMessage:
              'Переназначаю задачу из-за изменения приоритетов',
            context: {
              reason: 'priority_change',
              urgency: 'immediate',
            },
            triggerType: 'manual',
          },
        },
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Task successfully assigned',
      type: AssignTaskResponseDto,
      example: {
        success: true,
        message: 'Task successfully assigned to john.doe@example.com',
        taskId: '550e8400-e29b-41d4-a716-446655440000',
        assignment: {
          id: 'assignment-123',
          taskId: '550e8400-e29b-41d4-a716-446655440000',
          assigneeEmail: 'john.doe@example.com',
          assigneeName: 'John Doe',
          assignedByEmail: 'manager@example.com',
          assignedByName: 'Project Manager',
          assignmentMessage: 'Назначаю тебе эту задачу',
          assignedAt: '2024-01-01T12:00:00Z',
          context: { priority: 'high' },
          agentId: 'uuid-agent-123',
          triggerType: 'agent_instruction',
        },
        timestamp: '2024-01-01T12:00:00.000Z',
        metadata: {
          previousAssignee: 'previous.user@example.com',
          notificationsSent: ['email'],
          queueJobId: 'assign-assignment-123',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Invalid request data',
      example: {
        statusCode: 400,
        message: [
          'assigneeEmail must be a valid email',
          'assigneeEmail should not be empty',
        ],
        error: 'Bad Request',
      },
    }),

    ApiNotFoundResponse({
      description: 'Task not found',
      example: {
        statusCode: 404,
        message: 'Task with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        error: 'Not Found',
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error during assignment',
      example: {
        statusCode: 500,
        message: 'Failed to assign task',
        error: 'Internal Server Error',
      },
    }),
  );
}
