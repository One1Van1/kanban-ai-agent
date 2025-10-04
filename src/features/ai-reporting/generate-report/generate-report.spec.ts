import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GenerateReportController } from './generate-report.controller';
import { GenerateReportService } from './generate-report.service';
import { ConfigService } from '@nestjs/config';
import { SearchTasksService } from '../../../jira/search-tasks/search-tasks.service';

describe('GenerateReportController (E2E)', () => {
  let app: INestApplication;
  let service: GenerateReportService;

  const mockSearchTasksService = {
    searchTasksByJql: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateReportController],
      providers: [
        GenerateReportService,
        {
          provide: SearchTasksService,
          useValue: mockSearchTasksService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    service = module.get<GenerateReportService>(GenerateReportService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate report successfully', async () => {
    // Mock search results
    mockSearchTasksService.searchTasksByJql.mockResolvedValue({
      issues: [
        {
          key: 'TEST-1',
          fields: {
            summary: 'Тестовая стрижка',
            created: '2025-10-01T10:00:00.000Z',
            comment: {
              comments: [
                {
                  body: {
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            text: '🤖 **AI АНАЛИЗ СТРИЖКИ**\nОценка: 8/10\nПол: Мужской\nСтиль: Классическая',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      ],
    });

    const requestDto = {
      taskKey: 'KAN-33',
      dateRange: 'сегодня',
      assigneeEmail: 'test@example.com',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report')
      .send(requestDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('statistics');
        expect(res.body).toHaveProperty('detailedAnalysis');
        expect(res.body).toHaveProperty('recommendations');
        expect(res.body).toHaveProperty('reportDate');
        expect(res.body.statistics).toHaveProperty('totalHaircuts');
        expect(res.body.detailedAnalysis).toBeInstanceOf(Array);
        expect(res.body.recommendations).toBeInstanceOf(Array);
      });
  });

  it('should handle validation errors', async () => {
    const invalidDto = {
      taskKey: '', // Empty task key should fail validation
      dateRange: 'сегодня',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report')
      .send(invalidDto)
      .expect(400);
  });

  it('should handle empty results', async () => {
    mockSearchTasksService.searchTasksByJql.mockResolvedValue({
      issues: [],
    });

    const requestDto = {
      taskKey: 'KAN-33',
      dateRange: 'сегодня',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report')
      .send(requestDto)
      .expect(201)
      .then((res) => {
        expect(res.body.statistics.totalHaircuts).toBe(0);
        expect(res.body.detailedAnalysis).toHaveLength(0);
        expect(res.body.recommendations).toContain(
          'Не найдено выполненных работ за указанный период.',
        );
      });
  });
});
