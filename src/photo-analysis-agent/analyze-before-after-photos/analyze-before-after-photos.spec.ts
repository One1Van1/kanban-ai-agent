import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { ClaudeVisionService } from './claude-vision.service';

describe('AnalyzeBeforeAfterPhotosService', () => {
  let service: AnalyzeBeforeAfterPhotosService;
  let claudeVisionService: ClaudeVisionService;

  // Mock base64 изображений для тестов
  const mockBeforePhoto = {
    filename: 'before_test.jpg',
    content:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    size: 1024,
  };

  const mockAfterPhoto = {
    filename: 'after_test.jpg',
    content:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    size: 1024,
  };

  const mockAnalysisResult = {
    transformation: {
      category: 'Обычная стрижка' as const,
      difficultyLevel: 6,
      visualChanges: ['Укорочены виски', 'Сделаны переходы'],
      technique: 'Машинка + ножницы',
    },
    quality: {
      overallScore: 8.5,
      evenness: 8,
      transitions: 9,
      symmetry: 8,
      cleanliness: 9,
      styleCompliance: 8,
    },
    timeAnalysis: {
      actualMinutes: 45,
      expectedRange: '30-60 мин',
      efficiency: 'good' as const,
    },
    report: {
      summary: 'Качественная стрижка',
      strengths: ['Отличные переходы'],
      improvements: ['Больше внимания к симметрии'],
      finalPrice: 800,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzeBeforeAfterPhotosService,
        {
          provide: ClaudeVisionService,
          useValue: {
            analyzeBeforeAfterPhotos: jest
              .fn()
              .mockResolvedValue(mockAnalysisResult),
            healthCheck: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, any> = {
                'claude.apiKey': 'test-api-key',
                'claude.model': 'claude-3-5-sonnet-20241022',
                'claude.maxTokens': 2048,
                'claude.temperature': 0.3,
              };
              return config[key];
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
  });

  describe('analyze', () => {
    it('should successfully analyze before/after photos', async () => {
      const result = await service.analyze(
        'TEST-123',
        mockBeforePhoto,
        mockAfterPhoto,
        45,
      );

      expect(result).toEqual(mockAnalysisResult);
      expect(claudeVisionService.analyzeBeforeAfterPhotos).toHaveBeenCalledWith(
        mockBeforePhoto.content,
        mockAfterPhoto.content,
        'TEST-123',
        45,
      );
    });

    it('should handle analysis without time', async () => {
      await service.analyze('TEST-123', mockBeforePhoto, mockAfterPhoto);

      expect(claudeVisionService.analyzeBeforeAfterPhotos).toHaveBeenCalledWith(
        mockBeforePhoto.content,
        mockAfterPhoto.content,
        'TEST-123',
        undefined,
      );
    });
  });

  describe('validatePhotos', () => {
    it('should validate correct photos', async () => {
      const result = await service.validatePhotos(
        mockBeforePhoto,
        mockAfterPhoto,
      );
      expect(result).toBe(true);
    });

    it('should throw error for missing photo content', async () => {
      const invalidPhoto = { ...mockBeforePhoto, content: '' };

      await expect(
        service.validatePhotos(invalidPhoto, mockAfterPhoto),
      ).rejects.toThrow('Отсутствует содержимое изображений');
    });

    it('should throw error for invalid base64', async () => {
      const invalidPhoto = { ...mockBeforePhoto, content: 'invalid-base64' };

      await expect(
        service.validatePhotos(invalidPhoto, mockAfterPhoto),
      ).rejects.toThrow('Неверный формат изображения');
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when Claude is available', async () => {
      const result = await service.healthCheck();

      expect(result).toEqual({
        status: 'healthy',
        claude: true,
      });
    });

    it('should return degraded status when Claude is unavailable', async () => {
      jest.spyOn(claudeVisionService, 'healthCheck').mockResolvedValue(false);

      const result = await service.healthCheck();

      expect(result).toEqual({
        status: 'degraded',
        claude: false,
      });
    });
  });
});
