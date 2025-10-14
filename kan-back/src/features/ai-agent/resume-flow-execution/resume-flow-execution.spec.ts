import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ResumeFlowExecutionController } from './resume-flow-execution.controller';
import { ResumeFlowExecutionService } from './resume-flow-execution.service';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

describe('ResumeFlowExecutionController (E2E)', () => {
  let app: INestApplication;
  let resumeFlowExecutionService: ResumeFlowExecutionService;

  const mockSuccessResponse = {
    executionId: 'exec-001',
    flowId: 'flow-001',
    status: FlowExecutionStatus.RUNNING,
    resumedAt: new Date('2024-01-15T10:10:15Z'),
    pausedDuration: 285,
    currentStep: 3,
    totalSteps: 8,
    progress: 37.5,
    message: 'Flow execution has been successfully resumed',
    restoredContext: {
      variablesRestored: 3,
      checkpointRestored: 'after_user_input_validation',
      stateValidated: true,
    },
    nextStepInfo: {
      nextStepNumber: 4,
      nextStepName: 'Step 4: Continue processing',
      estimatedDuration: 120,
      stepsRemaining: 5,
    },
    resumeSuccessful: true,
  };

  const mockResumeFlowExecutionService = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ResumeFlowExecutionController],
      providers: [
        {
          provide: ResumeFlowExecutionService,
          useValue: mockResumeFlowExecutionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    resumeFlowExecutionService = moduleFixture.get<ResumeFlowExecutionService>(
      ResumeFlowExecutionService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ai-agent/flow-execution/:executionId/resume', () => {
    it('should successfully resume a paused flow execution', async () => {
      // Arrange
      const executionId = 'exec-001';
      mockResumeFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(201);

      expect(response.body).toEqual(mockSuccessResponse);
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when flow execution does not exist', async () => {
      // Arrange
      const executionId = 'non-existent-exec';
      const notFoundError = {
        statusCode: 404,
        message: 'Flow execution with ID non-existent-exec not found',
        error: 'Not Found',
      };

      mockResumeFlowExecutionService.execute.mockRejectedValue({
        status: 404,
        message: notFoundError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(404);

      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should return 400 when flow execution cannot be resumed (wrong status)', async () => {
      // Arrange
      const executionId = 'exec-running';
      const badRequestError = {
        statusCode: 400,
        message:
          'Cannot resume flow execution. Current status: RUNNING. Only PAUSED executions can be resumed.',
        error: 'Bad Request',
      };

      mockResumeFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(400);

      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should return 400 when execution context is lost', async () => {
      // Arrange
      const executionId = 'exec-context-lost';
      const badRequestError = {
        statusCode: 400,
        message:
          'Cannot resume flow execution. The execution state has been lost and cannot be restored.',
        error: 'Bad Request',
      };

      mockResumeFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(400);

      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should return 400 when execution cannot be resumed', async () => {
      // Arrange
      const executionId = 'exec-non-resumable';
      const badRequestError = {
        statusCode: 400,
        message:
          'This flow execution cannot be resumed. The execution context may have been lost or corrupted.',
        error: 'Bad Request',
      };

      mockResumeFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(400);

      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should handle invalid execution ID format gracefully', async () => {
      // Arrange
      const executionId = '';

      // Act & Assert
      await request(app.getHttpServer())
        .post('/ai-agent/flow-execution//resume')
        .expect(404); // NestJS routes to 404 for empty path parameters

      expect(mockResumeFlowExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should validate resumed execution state properties', async () => {
      // Arrange
      const executionId = 'exec-state-validation';
      const responseWithDetailedState = {
        ...mockSuccessResponse,
        executionId,
        pausedDuration: 600, // 10 minutes
        restoredContext: {
          variablesRestored: 5,
          checkpointRestored: 'before_api_call_execution',
          stateValidated: true,
        },
        nextStepInfo: {
          nextStepNumber: 6,
          nextStepName: 'Step 6: Execute API calls',
          estimatedDuration: 180,
          stepsRemaining: 2,
        },
      };

      mockResumeFlowExecutionService.execute.mockResolvedValue(
        responseWithDetailedState,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(201);

      expect(response.body.status).toBe(FlowExecutionStatus.RUNNING);
      expect(response.body.resumedAt).toBeDefined();
      expect(response.body.pausedDuration).toBe(600);
      expect(response.body.restoredContext.variablesRestored).toBe(5);
      expect(response.body.restoredContext.stateValidated).toBe(true);
      expect(response.body.nextStepInfo.stepsRemaining).toBe(2);
      expect(response.body.resumeSuccessful).toBe(true);
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should verify context restoration functionality', async () => {
      // Arrange
      const executionId = 'exec-context-restore';
      const contextRestorationResponse = {
        ...mockSuccessResponse,
        executionId,
        restoredContext: {
          variablesRestored: 8,
          checkpointRestored: 'middleware_validation_complete',
          stateValidated: true,
        },
        message:
          'Flow execution has been successfully resumed with full context restoration',
      };

      mockResumeFlowExecutionService.execute.mockResolvedValue(
        contextRestorationResponse,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(201);

      expect(response.body.restoredContext.variablesRestored).toBe(8);
      expect(response.body.restoredContext.checkpointRestored).toBe(
        'middleware_validation_complete',
      );
      expect(response.body.message).toContain('full context restoration');
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });
  });

  describe('Service Integration', () => {
    it('should call service with correct parameters', async () => {
      // Arrange
      const executionId = 'test-exec-456';
      mockResumeFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/resume`)
        .expect(201);

      // Assert
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
      expect(mockResumeFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });
  });
});
