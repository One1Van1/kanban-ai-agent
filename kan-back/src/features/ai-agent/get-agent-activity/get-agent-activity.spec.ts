import { Test, TestingModule } from '@nestjs/testing';
import { GetAgentActivityController } from './get-agent-activity.controller';
import { GetAgentActivityService } from './get-agent-activity.service';
import { ActivityResultFilter } from './get-agent-activity.request.dto';
import { ActivityResult } from './get-agent-activity.response.dto';

describe('GetAgentActivityController', () => {
  let controller: GetAgentActivityController;
  let service: GetAgentActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAgentActivityController],
      providers: [GetAgentActivityService],
    }).compile();

    controller = module.get<GetAgentActivityController>(
      GetAgentActivityController,
    );
    service = module.get<GetAgentActivityService>(GetAgentActivityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should get agent activity with default parameters', async () => {
      const agentId = 'agent_123';
      const query = {};

      const result = await controller.handle(agentId, query);

      expect(result).toBeDefined();
      expect(result.activities).toBeDefined();
      expect(Array.isArray(result.activities)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.count).toBe(result.activities.length);
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.summary).toBeDefined();
      expect(result.summary.successCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.errorCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.pendingCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.avgExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should get agent activity with pagination', async () => {
      const agentId = 'agent_123';
      const query = {
        limit: 5,
        offset: 1,
      };

      const result = await controller.handle(agentId, query);

      expect(result.limit).toBe(5);
      expect(result.offset).toBe(1);
      expect(result.activities.length).toBeLessThanOrEqual(5);
    });

    it('should filter activity by result status', async () => {
      const agentId = 'agent_123';
      const query = {
        result: ActivityResultFilter.SUCCESS,
      };

      const result = await controller.handle(agentId, query);

      expect(
        result.activities.every(
          (activity) => activity.result === ActivityResult.SUCCESS,
        ),
      ).toBe(true);
    });

    it('should filter activity by task ID', async () => {
      const agentId = 'agent_123';
      const taskId = 'task_456';
      const query = {
        taskId,
      };

      const result = await controller.handle(agentId, query);

      expect(
        result.activities.every((activity) => activity.taskId === taskId),
      ).toBe(true);
    });

    it('should filter activity by date range', async () => {
      const agentId = 'agent_123';
      const query = {
        fromDate: '2023-12-01',
        toDate: '2023-12-31',
      };

      const result = await controller.handle(agentId, query);

      const fromDate = new Date('2023-12-01');
      const toDate = new Date('2023-12-31');
      toDate.setHours(23, 59, 59, 999);

      expect(
        result.activities.every((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= fromDate && activityDate <= toDate;
        }),
      ).toBe(true);
    });

    it('should return activities sorted by creation date (newest first)', async () => {
      const agentId = 'agent_123';
      const query = {};

      const result = await controller.handle(agentId, query);

      if (result.activities.length > 1) {
        for (let i = 1; i < result.activities.length; i++) {
          const currentDate = new Date(result.activities[i].createdAt);
          const previousDate = new Date(result.activities[i - 1].createdAt);
          expect(currentDate.getTime()).toBeLessThanOrEqual(
            previousDate.getTime(),
          );
        }
      }
    });

    it('should return empty activities for non-existent agent', async () => {
      const agentId = 'non_existent_agent';
      const query = {};

      const result = await controller.handle(agentId, query);

      expect(result.activities).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.count).toBe(0);
      expect(result.summary.successCount).toBe(0);
      expect(result.summary.errorCount).toBe(0);
      expect(result.summary.pendingCount).toBe(0);
    });

    it('should handle complex filtering', async () => {
      const agentId = 'agent_123';
      const query = {
        result: ActivityResultFilter.SUCCESS,
        limit: 2,
        offset: 0,
        fromDate: '2023-12-07',
      };

      const result = await controller.handle(agentId, query);

      expect(result.limit).toBe(2);
      expect(result.offset).toBe(0);
      expect(result.activities.length).toBeLessThanOrEqual(2);
      expect(
        result.activities.every(
          (activity) => activity.result === ActivityResult.SUCCESS,
        ),
      ).toBe(true);

      const fromDate = new Date('2023-12-07');
      expect(
        result.activities.every((activity) => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= fromDate;
        }),
      ).toBe(true);
    });
  });
});
