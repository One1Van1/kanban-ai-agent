import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CancelFlowExecutionController } from './cancel-flow-execution.controller';
import { CancelFlowExecutionService } from './cancel-flow-execution.service';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

describe('CancelFlowExecutionController (E2E)', () => {
  let app: INestApplication;
  let cancelFlowExecutionService: CancelFlowExecutionService;

  const mockSuccessResponse = {
    executionId: 'exec-001',
    flowId: 'flow-001',
    status: FlowExecutionStatus.CANCELLED,
    cancelledAt: new Date('2024-01-15T10:15:45Z'),
    cancelReason: 'Cancelled by user',
    wasForced: false,
    currentStep: 3,
    totalSteps: 8,
    progress: 37.5,
    message: 'Flow execution has been successfully cancelled',
    cleanupResult: {
      cleanupSteps: [
        'Terminated 2 active connections: jira-api, database',
        'Freed 2 resources: temp-file-001.json, api-session-abc123',
      ],
      cleanupDuration: 150,
      cleanupSuccessful: true,
      warningsGenerated: [],
      resourcesRecovered: 2,
      connectionsTerminated: 2,
    },
    rollbackPerformed: false,
    resourcesFreed: 2,
    connectionsTerminated: 2,
  };

  const mockCancelFlowExecutionService = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CancelFlowExecutionController],
      providers: [
        {
          provide: CancelFlowExecutionService,
          useValue: mockCancelFlowExecutionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cancelFlowExecutionService = moduleFixture.get<CancelFlowExecutionService>(
      CancelFlowExecutionService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ai-agent/flow-execution/:executionId/cancel', () => {
    it('should successfully cancel a running flow execution', async () => {
      // Arrange
      const executionId = 'exec-001';
      mockCancelFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(201);

      expect(response.body).toEqual(mockSuccessResponse);
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });

    it('should successfully force cancel a flow execution', async () => {
      // Arrange
      const executionId = 'exec-001';
      const forceResponse = {
        ...mockSuccessResponse,
        wasForced: true,
        cancelReason: 'Force cancelled by user',
        cleanupResult: {
          ...mockSuccessResponse.cleanupResult,
          warningsGenerated: ['Force cancellation may have side effects'],
        },
      };
      mockCancelFlowExecutionService.execute.mockResolvedValue(forceResponse);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel?force=true`)
        .expect(201);

      expect(response.body.wasForced).toBe(true);
      expect(response.body.cleanupResult.warningsGenerated).toContain(
        'Force cancellation may have side effects',
      );
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        true,
      );
    });

    it('should return 404 when flow execution does not exist', async () => {
      // Arrange
      const executionId = 'non-existent-exec';
      const notFoundError = {
        statusCode: 404,
        message: 'Flow execution with ID non-existent-exec not found',
        error: 'Not Found',
      };

      mockCancelFlowExecutionService.execute.mockRejectedValue({
        status: 404,
        message: notFoundError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(404);

      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });

    it('should return 400 when flow execution is already completed', async () => {
      // Arrange
      const executionId = 'exec-completed';
      const badRequestError = {
        statusCode: 400,
        message:
          'Cannot cancel flow execution. Execution has already completed successfully.',
        error: 'Bad Request',
      };

      mockCancelFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(400);

      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });

    it('should return 400 when flow execution is already cancelled', async () => {
      // Arrange
      const executionId = 'exec-already-cancelled';
      const badRequestError = {
        statusCode: 400,
        message: 'Flow execution is already cancelled.',
        error: 'Bad Request',
      };

      mockCancelFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(400);

      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });

    it("should return 400 when it's not safe to cancel without force", async () => {
      // Arrange
      const executionId = 'exec-unsafe';
      const badRequestError = {
        statusCode: 400,
        message:
          'Cannot safely cancel flow execution. Active transactions or connections detected. Use force=true to override.',
        error: 'Bad Request',
      };

      mockCancelFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(400);

      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });

    it('should handle invalid execution ID format gracefully', async () => {
      // Arrange
      const executionId = '';

      // Act & Assert
      await request(app.getHttpServer())
        .post('/ai-agent/flow-execution//cancel')
        .expect(404); // NestJS routes to 404 for empty path parameters

      expect(mockCancelFlowExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should validate cancelled execution state and cleanup results', async () => {
      // Arrange
      const executionId = 'exec-cleanup-test';
      const responseWithCleanup = {
        ...mockSuccessResponse,
        executionId,
        rollbackPerformed: true,
        resourcesFreed: 5,
        connectionsTerminated: 3,
        cleanupResult: {
          cleanupSteps: [
            'Terminated 3 active connections: jira-api, database, external-webhook',
            'Freed 5 resources: temp-file-001.json, api-session-abc123, transaction-xyz789',
            'Performed transaction rollback',
          ],
          cleanupDuration: 350,
          cleanupSuccessful: true,
          warningsGenerated: [],
          resourcesRecovered: 5,
          connectionsTerminated: 3,
        },
      };

      mockCancelFlowExecutionService.execute.mockResolvedValue(
        responseWithCleanup,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(201);

      expect(response.body.status).toBe(FlowExecutionStatus.CANCELLED);
      expect(response.body.rollbackPerformed).toBe(true);
      expect(response.body.resourcesFreed).toBe(5);
      expect(response.body.connectionsTerminated).toBe(3);
      expect(response.body.cleanupResult.cleanupSuccessful).toBe(true);
      expect(response.body.cleanupResult.cleanupSteps).toHaveLength(3);
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });

    it('should handle force cancellation with warnings', async () => {
      // Arrange
      const executionId = 'exec-force-warning';
      const forceResponseWithWarnings = {
        ...mockSuccessResponse,
        executionId,
        wasForced: true,
        cancelReason: 'Force cancelled by user',
        cleanupResult: {
          ...mockSuccessResponse.cleanupResult,
          warningsGenerated: [
            'Force cancellation may have side effects',
            'Transaction rollback incomplete',
          ],
          cleanupSteps: [
            'Force terminated 2 connections',
            'Force rollback: some changes may not be reversible',
          ],
        },
      };

      mockCancelFlowExecutionService.execute.mockResolvedValue(
        forceResponseWithWarnings,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel?force=true`)
        .expect(201);

      expect(response.body.wasForced).toBe(true);
      expect(response.body.cleanupResult.warningsGenerated).toHaveLength(2);
      expect(response.body.cleanupResult.warningsGenerated).toContain(
        'Force cancellation may have side effects',
      );
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        true,
      );
    });

    it('should handle force parameter correctly', async () => {
      // Arrange
      const executionId = 'exec-force-param';
      mockCancelFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel?force=false`)
        .expect(201);

      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
    });
  });

  describe('Service Integration', () => {
    it('should call service with correct parameters for normal cancel', async () => {
      // Arrange
      const executionId = 'test-exec-789';
      mockCancelFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel`)
        .expect(201);

      // Assert
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        false,
      );
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });

    it('should call service with correct parameters for force cancel', async () => {
      // Arrange
      const executionId = 'test-exec-force';
      mockCancelFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/cancel?force=true`)
        .expect(201);

      // Assert
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
        true,
      );
      expect(mockCancelFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });
  });
});
