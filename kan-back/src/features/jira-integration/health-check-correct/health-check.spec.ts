import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

describe('HealthCheckController (E2E)', () => {
  let controller: HealthCheckController;
  let service: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
    service = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', async () => {
    const mockResponse = {
      status: 'ok',
      jiraUrl: 'https://test.atlassian.net',
      projectKey: 'KAN',
      timestamp: '2024-01-20T12:00:00Z',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle();

    expect(service.execute).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
