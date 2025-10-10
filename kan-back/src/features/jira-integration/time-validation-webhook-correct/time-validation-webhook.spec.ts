import { Test, TestingModule } from '@nestjs/testing';
import { TimeValidationWebhookController } from './time-validation-webhook.controller';
import { TimeValidationWebhookService } from './time-validation-webhook.service';

describe('TimeValidationWebhookController (E2E)', () => {
  let controller: TimeValidationWebhookController;
  let service: TimeValidationWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeValidationWebhookController],
      providers: [
        {
          provide: TimeValidationWebhookService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TimeValidationWebhookController>(
      TimeValidationWebhookController,
    );
    service = module.get<TimeValidationWebhookService>(
      TimeValidationWebhookService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should validate time for webhook', async () => {
    const mockRequest = {
      webhookEvent: 'jira:issue_updated',
      issue: {
        key: 'KAN-5',
        fields: {
          status: { name: 'Done' },
          timespent: 3600,
          timeoriginalestimate: 7200,
        },
      },
    };

    const mockResponse = {
      status: 'validated',
      issueKey: 'KAN-5',
      isValid: true,
      processedAt: '2024-01-20T12:00:00Z',
      validationDetails: {
        timeSpent: 3600,
        efficiency: 50,
      },
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(service.execute).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
