import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';
import { of } from 'rxjs';

describe('ProcessWebhookBeforeAfterService', () => {
  let service: ProcessWebhookBeforeAfterService;
  let httpService: HttpService;

  // Mock данные для тестов
  const mockValidPayload = {
    webhookEvent: 'jira:issue_updated',
    timestamp: Date.now(),
    issue: {
      id: '12345',
      key: 'HAIR-123',
      self: 'https://example.atlassian.net/rest/api/2/issue/12345',
      fields: {
        summary: 'Классическая мужская стрижка клиента',
        description: 'Выполнить стрижку согласно пожеланиям клиента',
        status: {
          id: '3',
          name: 'Review',
          statusCategory: {
            id: 4,
            key: 'indeterminate',
            name: 'In Progress',
          },
        },
        issuetype: {
          id: '10001',
          name: 'Task',
          iconUrl: 'https://example.atlassian.net/icon.png',
        },
        created: '2025-09-26T08:00:00.000Z',
        updated: '2025-09-26T10:00:00.000Z',
        attachment: [
          {
            id: '67890',
            filename: 'before_haircut.jpg',
            mimeType: 'image/jpeg',
            size: 1024000,
            content: 'https://example.atlassian.net/secure/attachment/67890/',
            created: '2025-09-26T08:30:00.000Z',
            author: {
              accountId: 'user123',
              displayName: 'Test User',
              emailAddress: 'test@example.com',
            },
          },
        ],
      },
    },
  };

  const mockProcessResult = {
    success: true,
    taskKey: 'HAIR-123',
    processedAt: '2025-09-26T10:30:00.000Z',
    photoAnalysis: {
      success: true,
      category: 'classic_male',
      qualityScore: 8.5,
      description: 'Отличная мужская стрижка',
      recommendations: ['Хорошие переходы'],
    },
    timeAnalysis: {
      success: true,
      totalMinutes: 45,
      efficiency: 'good',
      efficiencyPercentage: 100,
      expectedRange: '30-60 мин',
      recommendations: ['Отличное время'],
    },
    combinedAnalysis: {
      overallScore: 8.2,
      summary: 'Отличная работа',
      recommendations: ['Продолжайте работу'],
    },
    commentId: 'comment-123',
    errors: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessWebhookBeforeAfterService,
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
                'app.baseUrl': 'http://localhost:3000',
                'jira.baseUrl': 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProcessWebhookBeforeAfterService>(
      ProcessWebhookBeforeAfterService,
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process valid haircut task webhook successfully', async () => {
    // Mock successful response
    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(of({ data: mockProcessResult }) as any);

    const result = await service.processWebhook(mockValidPayload as any);

    expect(result.success).toBe(true);
    expect(result.taskKey).toBe('HAIR-123');
    expect(result.triggeredActions.length).toBeGreaterThan(0);
  });

  it('should return metrics', () => {
    const metrics = service.getMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics.totalProcessed).toBe('number');
  });

  it('should return processing states', () => {
    const states = service.getProcessingStates(['HAIR-123']);
    expect(Array.isArray(states)).toBe(true);
  });

  it('should perform health check', async () => {
    // Mock health checks
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of({ data: { status: 'ok' } }) as any);

    const health = await service.healthCheck();
    expect(health.status).toBeDefined();
  });

  it('should cleanup old states', () => {
    expect(() => service.cleanupOldStates()).not.toThrow();
  });
});
