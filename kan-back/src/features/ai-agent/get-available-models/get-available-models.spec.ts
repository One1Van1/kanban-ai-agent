import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GetAvailableModelsController } from './get-available-models.controller';
import { GetAvailableModelsService } from './get-available-models.service';

describe('GetAvailableModelsController (E2E)', () => {
  let app: INestApplication;
  let getAvailableModelsService: GetAvailableModelsService;

  const mockModels = [
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description:
        'Most balanced model for complex reasoning and creative tasks',
      maxTokens: 4000,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'reasoning', 'coding'],
      pricing: {
        inputCost: 0.003,
        outputCost: 0.015,
        currency: 'USD',
      },
      isAvailable: true,
    },
    {
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Fastest and most cost-effective model for simple tasks',
      maxTokens: 4000,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'reasoning'],
      pricing: {
        inputCost: 0.00025,
        outputCost: 0.00125,
        currency: 'USD',
      },
      isAvailable: true,
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Latest GPT-4 model with enhanced performance and speed',
      maxTokens: 4096,
      contextWindow: 128000,
      capabilities: ['text', 'coding', 'reasoning'],
      pricing: {
        inputCost: 0.01,
        outputCost: 0.03,
        currency: 'USD',
      },
      isAvailable: false, // Not configured
    },
  ];

  const mockGetAvailableModelsService = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      message: 'Available AI models retrieved successfully',
      models: mockModels,
      totalModels: 3,
      availableModels: 2,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [GetAvailableModelsController],
      providers: [
        {
          provide: GetAvailableModelsService,
          useValue: mockGetAvailableModelsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getAvailableModelsService = moduleFixture.get<GetAvailableModelsService>(
      GetAvailableModelsService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /ai-agent/available-models', () => {
    it('should successfully retrieve available AI models', async () => {
      const response = await request(app.getHttpServer())
        .get('/ai-agent/available-models')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('models');
      expect(response.body).toHaveProperty('totalModels', 3);
      expect(response.body).toHaveProperty('availableModels', 2);

      // Проверяем структуру моделей
      const models = response.body.models;
      expect(Array.isArray(models)).toBe(true);
      expect(models).toHaveLength(3);

      // Проверяем структуру первой модели
      const firstModel = models[0];
      expect(firstModel).toHaveProperty('id');
      expect(firstModel).toHaveProperty('name');
      expect(firstModel).toHaveProperty('provider');
      expect(firstModel).toHaveProperty('description');
      expect(firstModel).toHaveProperty('maxTokens');
      expect(firstModel).toHaveProperty('contextWindow');
      expect(firstModel).toHaveProperty('capabilities');
      expect(firstModel).toHaveProperty('isAvailable');
      expect(Array.isArray(firstModel.capabilities)).toBe(true);

      // Проверяем что есть доступные модели
      const availableModels = models.filter((m: any) => m.isAvailable);
      expect(availableModels).toHaveLength(2);

      expect(mockGetAvailableModelsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return models with correct provider information', async () => {
      const response = await request(app.getHttpServer())
        .get('/ai-agent/available-models')
        .expect(200);

      const models = response.body.models;

      // Проверяем что есть модели от разных провайдеров
      const providers = [...new Set(models.map((m: any) => m.provider))];
      expect(providers).toContain('Anthropic');

      // Проверяем Claude модели
      const claudeModels = models.filter(
        (m: any) => m.provider === 'Anthropic',
      );
      expect(claudeModels.length).toBeGreaterThanOrEqual(1);

      claudeModels.forEach((model: any) => {
        expect(model.id).toMatch(/claude/i);
        expect(model.capabilities).toContain('text');
      });
    });

    it('should return models with pricing information', async () => {
      const response = await request(app.getHttpServer())
        .get('/ai-agent/available-models')
        .expect(200);

      const models = response.body.models;

      // Проверяем что у моделей есть информация о ценах
      const modelsWithPricing = models.filter((m: any) => m.pricing);
      expect(modelsWithPricing.length).toBeGreaterThan(0);

      modelsWithPricing.forEach((model: any) => {
        expect(model.pricing).toHaveProperty('inputCost');
        expect(model.pricing).toHaveProperty('outputCost');
        expect(model.pricing).toHaveProperty('currency');
        expect(typeof model.pricing.inputCost).toBe('number');
        expect(typeof model.pricing.outputCost).toBe('number');
      });
    });

    it('should handle service errors gracefully', async () => {
      mockGetAvailableModelsService.execute.mockRejectedValueOnce(
        new Error('Configuration error'),
      );

      await request(app.getHttpServer())
        .get('/ai-agent/available-models')
        .expect(500);
    });
  });
});
