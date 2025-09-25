import { Test, TestingModule } from '@nestjs/testing';
import { HaircutReportWebhookController } from './haircut-report-webhook.controller';
import { HaircutReportWebhookService } from './haircut-report-webhook.service';

describe('HaircutReportWebhookController', () => {
  let controller: HaircutReportWebhookController;
  let service: HaircutReportWebhookService;

  const mockWebhookService = {
    processWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HaircutReportWebhookController],
      providers: [
        {
          provide: HaircutReportWebhookService,
          useValue: mockWebhookService,
        },
      ],
    }).compile();

    controller = module.get<HaircutReportWebhookController>(
      HaircutReportWebhookController,
    );
    service = module.get<HaircutReportWebhookService>(
      HaircutReportWebhookService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleHaircutReportWebhook', () => {
    it('should process webhook successfully', async () => {
      const mockWebhookData = {
        webhookEvent: 'jira:issue_updated',
        timestamp: Date.now(),
        issue: {
          key: 'HAIR-123',
          fields: {
            summary: 'Стрижка клиента',
            status: { name: 'Review' },
          },
        },
      };

      const mockResult = {
        processed: true,
        taskKey: 'HAIR-123',
        analysisTriggered: true,
      };

      mockWebhookService.processWebhook.mockResolvedValue(mockResult);

      const result =
        await controller.handleHaircutReportWebhook(mockWebhookData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(service.processWebhook).toHaveBeenCalledWith(mockWebhookData);
    });

    it('should handle errors gracefully', async () => {
      const mockWebhookData = {
        webhookEvent: 'jira:issue_updated',
        timestamp: Date.now(),
      };

      mockWebhookService.processWebhook.mockRejectedValue(
        new Error('Test error'),
      );

      const result =
        await controller.handleHaircutReportWebhook(mockWebhookData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });
  });
});
