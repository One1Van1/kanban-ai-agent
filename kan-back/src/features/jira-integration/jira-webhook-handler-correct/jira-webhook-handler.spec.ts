import { Test, TestingModule } from '@nestjs/testing';
import { JiraWebhookHandlerController } from './jira-webhook-handler.controller';
import { JiraWebhookHandlerService } from './jira-webhook-handler.service';

describe('JiraWebhookHandlerController (E2E)', () => {
  let controller: JiraWebhookHandlerController;
  let service: JiraWebhookHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JiraWebhookHandlerController],
      providers: [
        {
          provide: JiraWebhookHandlerService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JiraWebhookHandlerController>(
      JiraWebhookHandlerController,
    );
    service = module.get<JiraWebhookHandlerService>(JiraWebhookHandlerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle webhook event', async () => {
    const mockRequest = {
      webhookEvent: 'jira:issue_updated',
      issue: {
        key: 'KAN-5',
        fields: {
          summary: 'Test task',
        },
      },
    };

    const mockResponse = {
      status: 'processed',
      issueKey: 'KAN-5',
      eventType: 'issue_updated',
      processedAt: '2024-01-20T12:00:00Z',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(service.execute).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
