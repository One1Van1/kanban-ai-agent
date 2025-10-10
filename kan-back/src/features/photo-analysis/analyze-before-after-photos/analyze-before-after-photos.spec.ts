import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeBeforeAfterPhotosController } from './analyze-before-after-photos.controller';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';

describe('AnalyzeBeforeAfterPhotosController (E2E)', () => {
  let controller: AnalyzeBeforeAfterPhotosController;
  let service: AnalyzeBeforeAfterPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzeBeforeAfterPhotosController],
      providers: [
        {
          provide: AnalyzeBeforeAfterPhotosService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyzeBeforeAfterPhotosController>(
      AnalyzeBeforeAfterPhotosController,
    );
    service = module.get<AnalyzeBeforeAfterPhotosService>(
      AnalyzeBeforeAfterPhotosService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should analyze before/after photos', async () => {
    const mockRequest = {
      taskKey: 'KAN-123',
      beforePhoto: 'base64-before-photo',
      afterPhoto: 'base64-after-photo',
      declaredCategory: 'Женская стрижка',
    };

    const mockResponse = {
      success: true,
      taskKey: 'KAN-123',
      message: 'Before/after analysis completed successfully',
      analysis: {
        detectedCategory: 'Женская стрижка',
        qualityScore: 85,
        improvements: ['Аккуратность линий'],
        compliance: true,
        notes: 'Качественная работа',
        confidenceLevel: 90,
      },
      processedAt: '2024-01-20T12:00:00Z',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(service.execute).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
