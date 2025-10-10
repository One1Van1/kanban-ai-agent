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
import { ChangeTaskStatusRequestDto } from './change-task-status.request.dto';
import { ChangeTaskStatusResponseDto } from './change-task-status.response.dto';

export function ApiChangeTaskStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change task status',
      description: `
        Changes the status of a task following workflow rules. This endpoint allows AI agents 
        and system components to update task statuses with proper validation and history tracking.

        **Key Features:**
        - Validates status transitions according to workflow rules
        - Tracks status change history in TaskHistory
        - Supports both manual and agent-triggered changes
        - Optional force mode to bypass workflow validation
        - Calculates time spent in previous status

        **Workflow Rules:**
        - TODO → IN_PROGRESS, BLOCKED, CANCELLED
        - IN_PROGRESS → IN_REVIEW, BLOCKED, TODO, CANCELLED
        - IN_REVIEW → TESTING, IN_PROGRESS, DONE, BLOCKED
        - TESTING → DONE, IN_REVIEW, BLOCKED
        - DONE → IN_REVIEW, TESTING (for rework)
        - BLOCKED → TODO, IN_PROGRESS, CANCELLED
        - CANCELLED → TODO (reactivation)

        **Status Change Process:**
        1. Validates task exists
        2. Checks workflow transition rules (unless forced)
        3. Creates status change record in TaskHistory
        4. Updates task context with change details
        5. Returns complete status change information

        **Use Cases:**
        - AI agent updating status based on task progress
        - Developer marking task as done
        - Project manager blocking/unblocking tasks
        - Automated status changes from CI/CD pipeline

        **Force Mode:**
        Use forceChange=true to bypass workflow validation for administrative changes.
      `,
      tags: ['Kanban Management', 'Task Status'],
    }),

    ApiParam({
      name: 'id',
      description: 'Unique identifier of the task to change status',
      example: '550e8400-e29b-41d4-a716-446655440000',
      type: 'string',
    }),

    ApiBody({
      type: ChangeTaskStatusRequestDto,
      description:
        'Status change details including new status and optional context',
      examples: {
        start_work: {
          summary: 'Start working on task',
          description: 'Moving task from TODO to IN_PROGRESS',
          value: {
            newStatus: 'in-progress',
            statusComment: 'Начинаю работу над задачей',
            changedByEmail: 'dev@example.com',
            changedByName: 'Developer',
            triggerType: 'manual',
          },
        },
        complete_task: {
          summary: 'Complete task',
          description: 'Moving task from TESTING to DONE',
          value: {
            newStatus: 'done',
            statusComment: 'Задача выполнена и протестирована',
            changedByEmail: 'tester@example.com',
            changedByName: 'QA Tester',
            context: {
              testResults: 'all_passed',
              deploymentReady: true,
            },
            triggerType: 'manual',
          },
        },
        block_task: {
          summary: 'Block task',
          description: 'Blocking task due to dependencies',
          value: {
            newStatus: 'blocked',
            statusComment: 'Заблокировано: ожидание API от backend команды',
            changedByEmail: 'pm@example.com',
            changedByName: 'Project Manager',
            context: {
              blockReason: 'dependency_wait',
              blockedBy: 'TASK-456',
              estimatedUnblockDate: '2024-01-15T10:00:00Z',
            },
            triggerType: 'manual',
          },
        },
        agent_status_change: {
          summary: 'AI agent status change',
          description: 'Agent automatically updating status based on criteria',
          value: {
            newStatus: 'in-review',
            statusComment:
              'Автоматически переведено в ревью после завершения разработки',
            context: {
              automaticTrigger: 'code_completion_detected',
              confidence: 0.95,
              criteria: ['all_commits_pushed', 'tests_passing', 'pr_created'],
            },
            agentId: 'status-monitor-agent-123',
            triggerType: 'agent_instruction',
          },
        },
        force_change: {
          summary: 'Force status change',
          description: 'Administrative override of workflow rules',
          value: {
            newStatus: 'cancelled',
            statusComment: 'Принудительная отмена по решению руководства',
            changedByEmail: 'admin@example.com',
            changedByName: 'System Administrator',
            forceChange: true,
            context: {
              reason: 'business_decision',
              approvedBy: 'CTO',
            },
            triggerType: 'manual',
          },
        },
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Task status successfully changed',
      type: ChangeTaskStatusResponseDto,
      example: {
        success: true,
        message: 'Task status changed from todo to in-progress',
        taskId: '550e8400-e29b-41d4-a716-446655440000',
        previousStatus: 'todo',
        currentStatus: 'in-progress',
        statusChange: {
          id: 'status-change-123',
          taskId: '550e8400-e29b-41d4-a716-446655440000',
          fromStatus: 'todo',
          toStatus: 'in-progress',
          changedByEmail: 'dev@example.com',
          changedByName: 'Developer',
          statusComment: 'Начинаю работу над задачей',
          changedAt: '2024-01-01T12:00:00Z',
          context: { reason: 'requirements_clarified' },
          agentId: 'uuid-agent-123',
          triggerType: 'manual',
          forceChange: false,
        },
        timestamp: '2024-01-01T12:00:00.000Z',
        metadata: {
          workflowValidation: 'passed',
          timeInPreviousStatus: '2 days 3 hours',
          allowedNextStatuses: ['in-review', 'blocked', 'todo', 'cancelled'],
          queueJobId: 'status-status-change-123',
          notificationsSent: ['email'],
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Invalid status transition or request data',
      content: {
        'application/json': {
          examples: {
        invalid_transition: {
          summary: 'Invalid workflow transition',
          value: {
            statusCode: 400,
            message:
              "Invalid status transition from 'todo' to 'done'. Allowed transitions: in-progress, blocked, cancelled",
            error: 'Bad Request',
          },
        },
        invalid_status: {
          summary: 'Invalid status value',
          value: {
            statusCode: 400,
            message: ['newStatus must be a valid enum value'],
            error: 'Bad Request',
          },
        },
        missing_status: {
          summary: 'Missing required status',
          value: {
            statusCode: 400,
            message: ['newStatus should not be empty'],
            error: 'Bad Request',
          },
        },
      },
        },
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
      description: 'Internal server error during status change',
      example: {
        statusCode: 500,
        message: 'Failed to change task status',
        error: 'Internal Server Error',
      },
    }),
  );
}
