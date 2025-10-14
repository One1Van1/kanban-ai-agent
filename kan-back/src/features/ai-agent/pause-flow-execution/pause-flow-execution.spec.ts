import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PauseFlowExecutionController } from './pause-flow-execution.controller';
import { PauseFlowExecutionService } from './pause-flow-execution.service';
import { FlowExecutionStatus } from '../get-flow-execution-status/get-flow-execution-status.response.dto';

describe('PauseFlowExecutionController (E2E)', () => {
  let app: INestApplication;
  let pauseFlowExecutionService: PauseFlowExecutionService;

  const mockSuccessResponse = {
    executionId: 'exec-001',
    flowId: 'flow-001',
    status: FlowExecutionStatus.PAUSED,
    pausedAt: new Date('2024-01-15T10:05:30Z'),
    pauseReason: 'Paused by user request',
    currentStep: 3,
    totalSteps: 8,
    progress: 37.5,
    message: 'Flow execution has been successfully paused',
    canBeResumed: true,
    estimatedResumeTime: null,
    nextAction: 'Use resume-flow-execution endpoint to continue',
  };

  const mockPauseFlowExecutionService = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PauseFlowExecutionController],
      providers: [
        {
          provide: PauseFlowExecutionService,
          useValue: mockPauseFlowExecutionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    pauseFlowExecutionService = moduleFixture.get<PauseFlowExecutionService>(
      PauseFlowExecutionService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ai-agent/flow-execution/:executionId/pause', () => {
    it('should successfully pause a running flow execution', async () => {
      // Arrange
      const executionId = 'exec-001';
      mockPauseFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(201);

      expect(response.body).toEqual(mockSuccessResponse);
      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when flow execution does not exist', async () => {
      // Arrange
      const executionId = 'non-existent-exec';
      const notFoundError = {
        statusCode: 404,
        message: 'Flow execution with ID non-existent-exec not found',
        error: 'Not Found',
      };

      mockPauseFlowExecutionService.execute.mockRejectedValue({
        status: 404,
        message: notFoundError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(404);

      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should return 400 when flow execution cannot be paused (wrong status)', async () => {
      // Arrange
      const executionId = 'exec-completed';
      const badRequestError = {
        statusCode: 400,
        message:
          'Cannot pause flow execution. Current status: COMPLETED. Only RUNNING executions can be paused.',
        error: 'Bad Request',
      };

      mockPauseFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(400);

      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should return 400 when flow execution is at non-pausable step', async () => {
      // Arrange
      const executionId = 'exec-atomic-step';
      const badRequestError = {
        statusCode: 400,
        message:
          'This flow execution cannot be paused at the current step. Some steps are atomic and must complete.',
        error: 'Bad Request',
      };

      mockPauseFlowExecutionService.execute.mockRejectedValue({
        status: 400,
        message: badRequestError.message,
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(400);

      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });

    it('should handle invalid execution ID format gracefully', async () => {
      // Arrange
      const executionId = '';

      // Act & Assert
      await request(app.getHttpServer())
        .post('/ai-agent/flow-execution//pause')
        .expect(404); // NestJS routes to 404 for empty path parameters

      expect(mockPauseFlowExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should preserve execution state properly after pause', async () => {
      // Arrange
      const executionId = 'exec-state-test';
      const responseWithState = {
        ...mockSuccessResponse,
        executionId,
        currentStep: 5,
        progress: 62.5,
        pausedAt: new Date('2024-01-15T11:30:00Z'),
        message: 'Flow execution has been successfully paused',
      };

      mockPauseFlowExecutionService.execute.mockResolvedValue(
        responseWithState,
      );

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(201);

      expect(response.body.currentStep).toBe(5);
      expect(response.body.progress).toBe(62.5);
      expect(response.body.status).toBe(FlowExecutionStatus.PAUSED);
      expect(response.body.canBeResumed).toBe(true);
      expect(response.body.pausedAt).toBeDefined();
      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
    });
  });

  describe('Service Integration', () => {
    it('should call service with correct parameters', async () => {
      // Arrange
      const executionId = 'test-exec-123';
      mockPauseFlowExecutionService.execute.mockResolvedValue(
        mockSuccessResponse,
      );

      // Act
      await request(app.getHttpServer())
        .post(`/ai-agent/flow-execution/${executionId}/pause`)
        .expect(201);

      // Assert
      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledWith(
        executionId,
      );
      expect(mockPauseFlowExecutionService.execute).toHaveBeenCalledTimes(1);
    });
  });
});
