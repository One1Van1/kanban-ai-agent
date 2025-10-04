import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { ClaudeVisionService } from './claude-vision.service';

describe('AnalyzeBeforeAfterPhotosService', () => {
  let service: AnalyzeBeforeAfterPhotosService;
  let claudeVisionService: ClaudeVisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzeBeforeAfterPhotosService,
        ClaudeVisionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'claude') {
                return {
                  apiKey: 'test-key',
                  model: 'claude-3-5-sonnet-20241022',
                  maxTokens: 4000,
                  temperature: 0.1,
                };
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyzeBeforeAfterPhotosService>(
      AnalyzeBeforeAfterPhotosService,
    );
    claudeVisionService = module.get<ClaudeVisionService>(ClaudeVisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(claudeVisionService).toBeDefined();
  });

  describe('analyzeBeforeAfterPhotos', () => {
    it('should return error if photos are missing', async () => {
      const dto = {
        taskKey: 'TEST-123',
        beforePhoto: '',
        afterPhoto: 'some-data',
      };

      const result = await service.analyzeBeforeAfterPhotos(dto);

      expect(result.success).toBe(false);
      expect(result.message).toContain(
        'Both before and after photos are required',
      );
    });

    it('should return service status', async () => {
      const status = await service.getServiceStatus();

      expect(status).toHaveProperty('claudeConfigured');
      expect(status).toHaveProperty('serviceName');
      expect(status.serviceName).toBe('Claude 3.5 Sonnet Vision Analysis');
    });
  });

  describe('ClaudeVisionService', () => {
    it('should create fallback result when Claude is not configured', () => {
      const mockConfigService = {
        get: jest.fn(() => ({ apiKey: '' })),
      };

      const service = new ClaudeVisionService(mockConfigService as any);
      const result = service['createFallbackResult']('Test reason');

      expect(result.transformation.category).toBe('Обычная стрижка');
      expect(result.quality.overallScore).toBe(7);
      expect(result.recommendations).toContain(
        'Claude анализ недоступен: Test reason',
      );
    });
  });
});
