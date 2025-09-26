import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeHaircutPhotoController } from './analyze-haircut-photo.controller';
import { AnalyzeHaircutPhotoService } from './analyze-haircut-photo.service';
import { AnalyzeHaircutPhotoDto } from './analyze-haircut-photo.dto';

describe('AnalyzeHaircutPhotoController', () => {
  let controller: AnalyzeHaircutPhotoController;
  let service: AnalyzeHaircutPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzeHaircutPhotoController],
      providers: [
        {
          provide: AnalyzeHaircutPhotoService,
          useValue: {
            analyzeHaircutPhotos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyzeHaircutPhotoController>(
      AnalyzeHaircutPhotoController,
    );
    service = module.get<AnalyzeHaircutPhotoService>(
      AnalyzeHaircutPhotoService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyzePhotos', () => {
    it('should analyze haircut photos successfully', async () => {
      const mockDto: AnalyzeHaircutPhotoDto = {
        taskKey: 'KAN-17',
        declaredCategory: 'Обычная стрижка',
        photos: [
          {
            url: 'https://example.com/haircut.jpg',
            filename: 'haircut.jpg',
            size: 1024000,
          },
        ],
      };

      const mockResponse = {
        success: true,
        message: 'Photo analysis completed successfully',
        analysis: {
          taskKey: 'KAN-17',
          analysisId: 'analysis_123',
          timestamp: new Date(),
          photoAnalysis: {
            qualityScore: 8.5,
            categoryMatch: true,
            detectedCategory: 'Обычная стрижка',
            technicalExecution: 'good' as const,
            details: {
              evenness: 9,
              transitions: 8,
              symmetry: 8,
              cleanliness: 9,
              styleCompliance: 8,
            },
            issues: [],
            highlights: ['Отличная работа'],
          },
          categoryVerification: {
            matches: true,
            confidence: 0.9,
            reasoning: 'Категория соответствует',
          },
          overallAssessment: {
            passed: true,
            score: 8.5,
            grade: 'B' as const,
            feedback: 'Хорошо',
            recommendations: [],
          },
          jiraActions: {
            shouldMoveToDone: true,
            shouldMoveToQuestions: false,
            commentToAdd: 'Test comment',
          },
        },
      };

      jest
        .spyOn(service, 'analyzeHaircutPhotos')
        .mockResolvedValue(mockResponse);

      const result = await controller.analyzePhotos(mockDto);

      expect(service.analyzeHaircutPhotos).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle errors during photo analysis', async () => {
      const mockDto: AnalyzeHaircutPhotoDto = {
        taskKey: 'KAN-17',
        declaredCategory: 'Обычная стрижка',
        photos: [],
      };

      const mockErrorResponse = {
        success: false,
        message: 'No photos provided for analysis',
        error: 'At least one photo is required',
      };

      jest
        .spyOn(service, 'analyzeHaircutPhotos')
        .mockResolvedValue(mockErrorResponse);

      const result = await controller.analyzePhotos(mockDto);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('AnalyzeHaircutPhotoService', () => {
  let service: AnalyzeHaircutPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzeHaircutPhotoService],
    }).compile();

    service = module.get<AnalyzeHaircutPhotoService>(
      AnalyzeHaircutPhotoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error when no photos provided', async () => {
    const dto: AnalyzeHaircutPhotoDto = {
      taskKey: 'KAN-17',
      declaredCategory: 'Обычная стрижка',
      photos: [],
    };

    const result = await service.analyzeHaircutPhotos(dto);

    expect(result.success).toBe(false);
    expect(result.error).toBe('At least one photo is required');
  });

  it('should analyze photos successfully', async () => {
    const dto: AnalyzeHaircutPhotoDto = {
      taskKey: 'KAN-17',
      declaredCategory: 'Обычная стрижка',
      photos: [
        {
          url: 'https://example.com/haircut.jpg',
          filename: 'haircut.jpg',
          size: 1024000,
        },
      ],
    };

    const result = await service.analyzeHaircutPhotos(dto);

    expect(result.success).toBe(true);
    expect(result.analysis).toBeDefined();
    expect(result.analysis?.taskKey).toBe('KAN-17');
  });
});
