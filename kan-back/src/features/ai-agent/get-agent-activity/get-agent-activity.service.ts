import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  GetAgentActivityRequestDto,
  ActivityResultFilter,
} from './get-agent-activity.request.dto';
import {
  GetAgentActivityResponseDto,
  AgentActivityResponseDto,
  ActivityResult,
} from './get-agent-activity.response.dto';
import { AgentActivity } from '../../../types/ai-agent.interface';

@Injectable()
export class GetAgentActivityService {
  private readonly logger = new Logger(GetAgentActivityService.name);

  // Mock data storage - in real implementation this would come from database
  private readonly mockActivities = new Map<string, AgentActivity[]>();

  constructor() {
    // Initialize with some mock data for testing
    this.initializeMockData();
  }

  async execute(
    request: GetAgentActivityRequestDto,
  ): Promise<GetAgentActivityResponseDto> {
    this.logger.log(`Getting activity for agent: ${request.agentId}`);

    try {
      // Validate input
      this.validateRequest(request);

      // Get activities for the agent
      let activities = this.mockActivities.get(request.agentId) || [];

      // Apply filters
      activities = this.applyFilters(activities, request);

      // Sort by creation date (newest first)
      activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Calculate total before pagination
      const total = activities.length;

      // Apply pagination
      const paginatedActivities = activities.slice(
        request.offset,
        request.offset! + request.limit!,
      );

      // Convert to response DTOs
      const activityDtos = paginatedActivities.map(
        (activity) =>
          new AgentActivityResponseDto({
            id: activity.id,
            agentId: activity.agentId,
            taskId: activity.taskId,
            action: activity.action,
            result: activity.result as ActivityResult,
            input: activity.input,
            output: activity.output,
            error: activity.error,
            executionTime: activity.executionTime,
            createdAt: activity.createdAt,
          }),
      );

      // Calculate summary statistics
      const allAgentActivities = this.mockActivities.get(request.agentId) || [];
      const summary = this.calculateSummary(allAgentActivities);

      this.logger.log(
        `Retrieved ${activityDtos.length} activities for agent: ${request.agentId}`,
      );

      return new GetAgentActivityResponseDto({
        activities: activityDtos,
        total,
        count: activityDtos.length,
        offset: request.offset!,
        limit: request.limit!,
        summary,
      });
    } catch (error) {
      this.logger.error(
        `Failed to get agent activity: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private validateRequest(request: GetAgentActivityRequestDto): void {
    if (!request.agentId || request.agentId.trim().length === 0) {
      throw new BadRequestException('Agent ID is required');
    }

    if (request.limit && (request.limit < 1 || request.limit > 100)) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    if (request.offset && request.offset < 0) {
      throw new BadRequestException('Offset must be non-negative');
    }

    // Validate date format if provided
    if (request.fromDate && !this.isValidDateString(request.fromDate)) {
      throw new BadRequestException('fromDate must be in YYYY-MM-DD format');
    }

    if (request.toDate && !this.isValidDateString(request.toDate)) {
      throw new BadRequestException('toDate must be in YYYY-MM-DD format');
    }
  }

  private applyFilters(
    activities: AgentActivity[],
    request: GetAgentActivityRequestDto,
  ): AgentActivity[] {
    let filtered = activities;

    // Filter by result status
    if (request.result && request.result !== ActivityResultFilter.ALL) {
      filtered = filtered.filter(
        (activity) => activity.result === request.result,
      );
    }

    // Filter by task ID
    if (request.taskId) {
      filtered = filtered.filter(
        (activity) => activity.taskId === request.taskId,
      );
    }

    // Filter by date range
    if (request.fromDate) {
      const fromDate = new Date(request.fromDate);
      filtered = filtered.filter((activity) => activity.createdAt >= fromDate);
    }

    if (request.toDate) {
      const toDate = new Date(request.toDate);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((activity) => activity.createdAt <= toDate);
    }

    return filtered;
  }

  private calculateSummary(activities: AgentActivity[]) {
    const successCount = activities.filter(
      (a) => a.result === 'success',
    ).length;
    const errorCount = activities.filter((a) => a.result === 'error').length;
    const pendingCount = activities.filter(
      (a) => a.result === 'pending',
    ).length;

    const totalExecutionTime = activities.reduce(
      (sum, a) => sum + a.executionTime,
      0,
    );
    const avgExecutionTime =
      activities.length > 0
        ? Math.round(totalExecutionTime / activities.length)
        : 0;

    return {
      successCount,
      errorCount,
      pendingCount,
      avgExecutionTime,
    };
  }

  private isValidDateString(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private initializeMockData(): void {
    // Mock activities for agent_123
    const agent123Activities: AgentActivity[] = [
      {
        id: 'activity_001',
        agentId: 'agent_123',
        taskId: 'task_456',
        action: 'task_moved_to_column_executed',
        result: 'success',
        input: {
          triggerType: 'task_moved_to_column',
          taskData: { title: 'Fix login bug', priority: 'high' },
        },
        output: [
          {
            actionType: 'priority_notification',
            description: 'High priority notification sent',
            data: { notificationSent: true },
          },
        ],
        executionTime: 1250,
        createdAt: new Date('2023-12-07T10:00:00.000Z'),
      },
      {
        id: 'activity_002',
        agentId: 'agent_123',
        taskId: 'task_789',
        action: 'task_assigned_executed',
        result: 'success',
        input: {
          triggerType: 'task_assigned',
          taskData: {
            title: 'Update documentation',
            assignee: 'john.doe@example.com',
          },
        },
        output: [
          {
            actionType: 'assignment_notification',
            description: 'Assignment notification sent',
            data: { notificationSent: true },
          },
        ],
        executionTime: 980,
        createdAt: new Date('2023-12-07T09:30:00.000Z'),
      },
      {
        id: 'activity_003',
        agentId: 'agent_123',
        taskId: 'task_111',
        action: 'task_moved_to_column_failed',
        result: 'error',
        input: {
          triggerType: 'task_moved_to_column',
          taskData: { title: 'Invalid task' },
        },
        error: 'Missing required field: assignee',
        executionTime: 450,
        createdAt: new Date('2023-12-07T08:15:00.000Z'),
      },
    ];

    this.mockActivities.set('agent_123', agent123Activities);

    // Mock activities for agent_456
    const agent456Activities: AgentActivity[] = [
      {
        id: 'activity_004',
        agentId: 'agent_456',
        taskId: 'task_222',
        action: 'task_priority_changed_executed',
        result: 'success',
        input: {
          triggerType: 'task_priority_changed',
          taskData: { title: 'Database optimization', priority: 'urgent' },
        },
        output: [
          {
            actionType: 'priority_escalation',
            description: 'Priority escalation notification sent',
            data: { escalated: true },
          },
        ],
        executionTime: 1100,
        createdAt: new Date('2023-12-06T16:20:00.000Z'),
      },
    ];

    this.mockActivities.set('agent_456', agent456Activities);
  }

  // Method to add new activity (used by other services)
  async addActivity(activity: AgentActivity): Promise<void> {
    const activities = this.mockActivities.get(activity.agentId) || [];
    activities.push(activity);
    this.mockActivities.set(activity.agentId, activities);
  }
}
