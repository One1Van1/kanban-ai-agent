import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetFlowExecutionStatusController } from './get-flow-execution-status.controller';
import { GetFlowExecutionStatusService } from './get-flow-execution-status.service';
import {
  FlowExecutionStatus,
  StepStatus,
} from './get-flow-execution-status.response.dto';

describe('GetFlowExecutionStatusController (E2E)', () => {
  let app: INestApplication;
  let getFlowExecutionStatusService: GetFlowExecutionStatusService;

  const mockMetrics = {
    startedAt: '2024-01-15T10:30:00Z',
    completedAt: undefined,
    duration: '00:15:30.456',
    progress: 60,
    totalSteps: 5,
    completedSteps: 3,
    failedSteps: 0,
    skippedSteps: 0,
    currentStep: 'step_4',
    estimatedCompletion: '2024-01-15T11:00:00Z',
  };

  const mockSteps = [
    {
      id: 'step_1',
      name: 'Initialize Flow',
      status: StepStatus.COMPLETED,
      order: 1,
      startedAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:30:15Z',
      duration: '00:00:15.000',
      result: 'Flow initialized successfully',
      progress: 100,
    },
    {
      id: 'step_2',
      name: 'Fetch Data',
      status: StepStatus.RUNNING,
      order: 2,
      startedAt: '2024-01-15T10:30:15Z',
      result: 'Processing data...',
      progress: 65,
    },
  ];

  const mockLogs = [
    {
      timestamp: '2024-01-15T10:30:00Z',
      level: 'info',
      stepId: 'step_1',
      message: 'Starting flow execution',
      context: { flowId: 'test_flow' },
    },
    {
      timestamp: '2024-01-15T10:30:15Z',
      level: 'info',
      stepId: 'step_2',
      message: 'Fetching data from API',
      context: { apiUrl: 'https://api.example.com' },
    },
  ];

  const mockVariables = {
    user_email: 'john.doe@company.com',
    task_count: 42,
    processing_status: true,
  };

  const mockResponse = {
    success: true,
    message: 'Flow execution status retrieved successfully',
    executionId: 'flow_exec_123',
    flowId: 'marketing_automation_v1',
    flowName: 'Marketing Campaign Automation',
    status: FlowExecutionStatus.RUNNING,
    metrics: mockMetrics,
    steps: mockSteps,
    logs: mockLogs,
    variables: mockVariables,
    startedBy: 'john.doe@company.com',
    lastUpdated: '2024-01-15T12:45:30Z',
  };

  const mockGetFlowExecutionStatusService = {
    execute: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetFlowExecutionStatusController],
      providers: [
        {
          provide: GetFlowExecutionStatusService,
          useValue: mockGetFlowExecutionStatusService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getFlowExecutionStatusService =
      moduleFixture.get<GetFlowExecutionStatusService>(
        GetFlowExecutionStatusService,
      );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /ai-agent/flow-execution/:executionId/status', () => {
    const executionId = 'flow_exec_123';

    it('should successfully retrieve flow execution status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('executionId', executionId);
      expect(response.body).toHaveProperty('flowId');
      expect(response.body).toHaveProperty('flowName');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('metrics');
      expect(response.body).toHaveProperty('startedBy');
      expect(response.body).toHaveProperty('lastUpdated');

      // Проверяем структуру метрик
      const metrics = response.body.metrics;
      expect(metrics).toHaveProperty('startedAt');
      expect(metrics).toHaveProperty('progress');
      expect(metrics).toHaveProperty('totalSteps');
      expect(metrics).toHaveProperty('completedSteps');
      expect(metrics).toHaveProperty('failedSteps');
      expect(metrics).toHaveProperty('skippedSteps');
      expect(typeof metrics.progress).toBe('number');
      expect(metrics.progress).toBeGreaterThanOrEqual(0);
      expect(metrics.progress).toBeLessThanOrEqual(100);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.any(Object),
      );
    });

    it('should handle includeSteps parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeSteps: true,
        })
        .expect(200);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.objectContaining({
          includeSteps: true,
        }),
      );

      // Проверяем что steps включены в ответ
      expect(response.body).toHaveProperty('steps');
      const steps = response.body.steps;
      expect(Array.isArray(steps)).toBe(true);

      if (steps.length > 0) {
        const firstStep = steps[0];
        expect(firstStep).toHaveProperty('id');
        expect(firstStep).toHaveProperty('name');
        expect(firstStep).toHaveProperty('status');
        expect(firstStep).toHaveProperty('order');
        expect(firstStep).toHaveProperty('progress');
      }
    });

    it('should handle includeLogs parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeLogs: true,
        })
        .expect(200);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.objectContaining({
          includeLogs: true,
        }),
      );

      // Проверяем что logs включены в ответ
      expect(response.body).toHaveProperty('logs');
      const logs = response.body.logs;
      expect(Array.isArray(logs)).toBe(true);

      if (logs.length > 0) {
        const firstLog = logs[0];
        expect(firstLog).toHaveProperty('timestamp');
        expect(firstLog).toHaveProperty('level');
        expect(firstLog).toHaveProperty('message');
        expect(['debug', 'info', 'warn', 'error']).toContain(firstLog.level);
      }
    });

    it('should handle includeVariables parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeVariables: true,
        })
        .expect(200);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.objectContaining({
          includeVariables: true,
        }),
      );

      // Проверяем что variables включены в ответ
      expect(response.body).toHaveProperty('variables');
      const variables = response.body.variables;
      expect(typeof variables).toBe('object');
    });

    it('should handle includeMetrics parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeMetrics: false,
        })
        .expect(200);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.objectContaining({
          includeMetrics: false,
        }),
      );
    });

    it('should handle multiple query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeSteps: true,
          includeLogs: true,
          includeVariables: true,
          includeMetrics: true,
        })
        .expect(200);

      expect(mockGetFlowExecutionStatusService.execute).toHaveBeenCalledWith(
        executionId,
        expect.objectContaining({
          includeSteps: true,
          includeLogs: true,
          includeVariables: true,
          includeMetrics: true,
        }),
      );

      // Проверяем что все опциональные поля включены
      expect(response.body).toHaveProperty('steps');
      expect(response.body).toHaveProperty('logs');
      expect(response.body).toHaveProperty('variables');
      expect(response.body).toHaveProperty('metrics');
    });

    it('should return correct flow execution statuses', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .expect(200);

      const status = response.body.status;
      expect([
        FlowExecutionStatus.PENDING,
        FlowExecutionStatus.RUNNING,
        FlowExecutionStatus.PAUSED,
        FlowExecutionStatus.COMPLETED,
        FlowExecutionStatus.FAILED,
        FlowExecutionStatus.CANCELLED,
      ]).toContain(status);
    });

    it('should return correct step statuses when includeSteps is true', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeSteps: true,
        })
        .expect(200);

      const steps = response.body.steps;
      if (steps && steps.length > 0) {
        steps.forEach((step: any) => {
          expect([
            StepStatus.WAITING,
            StepStatus.RUNNING,
            StepStatus.COMPLETED,
            StepStatus.FAILED,
            StepStatus.SKIPPED,
          ]).toContain(step.status);
        });
      }
    });

    it('should validate boolean query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .query({
          includeSteps: 'invalid_boolean', // Invalid boolean value
        })
        .expect(400);
    });

    it('should handle service errors gracefully', async () => {
      mockGetFlowExecutionStatusService.execute.mockRejectedValueOnce(
        new Error('Execution not found'),
      );

      await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .expect(500);
    });

    it('should handle not found executions', async () => {
      mockGetFlowExecutionStatusService.execute.mockRejectedValueOnce(
        new Error('Flow execution not found'),
      );

      await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/nonexistent_id/status`)
        .expect(500);
    });

    it('should return metrics with correct data types', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai-agent/flow-execution/${executionId}/status`)
        .expect(200);

      const metrics = response.body.metrics;
      expect(typeof metrics.totalSteps).toBe('number');
      expect(typeof metrics.completedSteps).toBe('number');
      expect(typeof metrics.failedSteps).toBe('number');
      expect(typeof metrics.skippedSteps).toBe('number');
      expect(typeof metrics.progress).toBe('number');
      expect(typeof metrics.startedAt).toBe('string');

      // Progress должен быть в диапазоне 0-100
      expect(metrics.progress).toBeGreaterThanOrEqual(0);
      expect(metrics.progress).toBeLessThanOrEqual(100);
    });
  });
});
