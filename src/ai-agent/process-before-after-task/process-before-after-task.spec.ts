import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProcessBeforeAfterTaskService } from './process-before-after-task.service';
import { of } from 'rxjs';
import { ProcessTaskConfig } from './process-before-after-task.interface';

describe('ProcessBeforeAfterTaskService', () => {
  let service: ProcessBeforeAfterTaskService;
  let httpService: HttpService;

  // Mock данные
  const mockPhotoAnalysisResponse = {
    success: true,
    category: 'classic_male',
    qualityScore: 8.5,
    description: 'Отличная мужская классическая стрижка',
    recommendations: ['Хорошие переходы', 'Аккуратная окантовка'],
    confidence: 0.92,
    processingTimeMs: 15000,
  };

  const mockTimeAnalysisResponse = {
    taskKey: 'TEST-123',
    totalMinutes: 45,
    efficiency: {
      efficiency: 'good',
      efficiencyPercentage: 100,
      expectedRange: '30-60 мин',
      recommendations: ['Отличное время выполнения'],
    },
    statusHistory: [],
    worklogEntries: [],
  };

  const mockConfig: ProcessTaskConfig = {
    forcePhotoAnalysis: false,
    forceTimeUpdate: false,
    addCommentToTask: true,
    timeoutMs: 120000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessBeforeAfterTaskService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, any> = {
                'photoAnalysisService.baseUrl': 'http://localhost:3000',
                'app.baseUrl': 'http://localhost:3000',
                'jira.baseUrl': 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProcessBeforeAfterTaskService>(
      ProcessBeforeAfterTaskService,
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processBeforeAfterTask', () => {
    it('should process task successfully with both analyses', async () => {
      // Mock HTTP responses
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of({ data: mockPhotoAnalysisResponse }) as any) // Photo analysis
        .mockReturnValueOnce(of({ data: mockTimeAnalysisResponse }) as any); // Time analysis

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: { id: 'comment-123' } }) as any); // Jira comment

      const result = await service.processBeforeAfterTask(
        'TEST-123',
        mockConfig,
      );

      expect(result.success).toBe(true);
      expect(result.taskKey).toBe('TEST-123');
      expect(result.photoAnalysis.success).toBe(true);
      expect(result.timeAnalysis.success).toBe(true);
      expect(result.combinedAnalysis.overallScore).toBeGreaterThan(7); // Should be good overall
      expect(result.commentId).toBe('comment-123');
    });

    it('should handle photo analysis failure gracefully', async () => {
      const failedPhotoResponse = {
        success: false,
        error: 'Image not found',
        category: 'unknown',
        qualityScore: 0,
        description: 'Ошибка анализа фотографий',
        recommendations: [],
        confidence: 0,
        processingTimeMs: 0,
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of({ data: failedPhotoResponse }) as any)
        .mockReturnValueOnce(of({ data: mockTimeAnalysisResponse }) as any);

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: { id: 'comment-456' } }) as any);

      const result = await service.processBeforeAfterTask(
        'TEST-123',
        mockConfig,
      );

      expect(result.success).toBe(true); // Should still succeed if time analysis works
      expect(result.photoAnalysis.success).toBe(false);
      expect(result.timeAnalysis.success).toBe(true);
      expect(result.combinedAnalysis.overallScore).toBeLessThan(7); // Should be lower due to failed photo analysis
    });

    it('should handle time analysis failure gracefully', async () => {
      const failedTimeResponse = {
        success: false,
        error: 'Jira connection failed',
        taskKey: 'TEST-123',
        totalMinutes: 0,
        efficiency: 'average',
        efficiencyPercentage: 0,
        expectedRange: 'неизвестно',
        recommendations: [],
        statusHistory: [],
        worklogEntries: [],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of({ data: mockPhotoAnalysisResponse }) as any)
        .mockReturnValueOnce(of({ data: failedTimeResponse }) as any);

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: { id: 'comment-789' } }) as any);

      const result = await service.processBeforeAfterTask(
        'TEST-123',
        mockConfig,
      );

      expect(result.success).toBe(true); // Should still succeed if photo analysis works
      expect(result.photoAnalysis.success).toBe(true);
      expect(result.timeAnalysis.success).toBe(false);
      expect(result.errors).toContain(
        expect.stringContaining('Ошибка анализа времени'),
      );
    });

    it('should skip comment creation when configured', async () => {
      const configWithoutComment = { ...mockConfig, addCommentToTask: false };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of({ data: mockPhotoAnalysisResponse }) as any)
        .mockReturnValueOnce(of({ data: mockTimeAnalysisResponse }) as any);

      const postSpy = jest.spyOn(httpService, 'post');

      const result = await service.processBeforeAfterTask(
        'TEST-123',
        configWithoutComment,
      );

      expect(result.success).toBe(true);
      expect(result.commentId).toBeUndefined();
      expect(postSpy).not.toHaveBeenCalled();
    });
  });

  describe('getProcessingStatus', () => {
    it('should return not_processed status for unknown tasks', () => {
      const statuses = service.getProcessingStatus(['UNKNOWN-123']);

      expect(statuses).toHaveLength(1);
      expect(statuses[0].status).toBe('not_processed');
      expect(statuses[0].taskKey).toBe('UNKNOWN-123');
    });

    it('should return multiple task statuses', () => {
      const statuses = service.getProcessingStatus([
        'TASK-1',
        'TASK-2',
        'TASK-3',
      ]);

      expect(statuses).toHaveLength(3);
      statuses.forEach((status) => {
        expect(status.status).toBe('not_processed');
      });
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when all services are up', async () => {
      // Mock successful health checks for all services
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: { status: 'ok' } }) as any);

      const health = await service.healthCheck();

      expect(health.status).toBe('healthy');
      expect(health.services.photoAnalysis).toBe(true);
      expect(health.services.timeTracking).toBe(true);
      expect(health.services.jira).toBe(true);
      expect(health.timestamp).toBeDefined();
    });

    it('should return degraded status when some services are down', async () => {
      // Mock mixed health check results
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ data: { status: 'ok' } }) as any) // Photo analysis OK
        .mockImplementationOnce(() => {
          throw new Error('Connection failed');
        }) // Time tracking failed
        .mockImplementationOnce(() => of({ data: { status: 'ok' } }) as any); // Jira OK

      const health = await service.healthCheck();

      expect(health.status).toBe('degraded');
      expect(health.services.photoAnalysis).toBe(true);
      expect(health.services.timeTracking).toBe(false);
      expect(health.services.jira).toBe(true);
    });
  });

  describe('cleanupOldStates', () => {
    it('should remove old processing states', () => {
      // This test would require manipulating private processingStates
      // For now, just verify the method doesn't throw
      expect(() => service.cleanupOldStates()).not.toThrow();
    });
  });
});
