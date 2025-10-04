import { Test, TestingModule } from '@nestjs/testing';
import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { ConfigService } from '@nestjs/config';
import { HaircutReportWebhookService } from '../haircut-report-webhook/haircut-report-webhook.service';

describe('TimeValidationWebhookService', () => {
  let service: TimeValidationWebhookService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockHaircutReportService: jest.Mocked<HaircutReportWebhookService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockHaircutReportService = {
      processWebhook: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeValidationWebhookService,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: HaircutReportWebhookService,
          useValue: mockHaircutReportService,
        },
      ],
    }).compile();

    service = module.get<TimeValidationWebhookService>(
      TimeValidationWebhookService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAndProcess', () => {
    it('should skip validation for non-Review transitions', async () => {
      const webhookData = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-001',
          fields: {
            status: { name: 'In Progress' },
            summary: 'Стрижка клиента',
          },
        },
      };

      const result = await service.validateAndProcess(webhookData as any);

      expect(result.validated).toBe(false);
      expect(result.action).toBe('approved');
    });

    it('should skip validation for non-haircut tasks', async () => {
      const webhookData = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-001',
          fields: {
            status: { name: 'Review' },
            summary: 'Software bug fix',
          },
        },
        changelog: {
          items: [{ field: 'status', toString: 'Review' }],
        },
      };

      const result = await service.validateAndProcess(webhookData as any);

      expect(result.validated).toBe(false);
      expect(result.action).toBe('approved');
    });

    it('should reject task with missing worklog', async () => {
      const webhookData = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-001',
          fields: {
            status: { name: 'Review' },
            summary: 'Стрижка клиента',
            assignee: { displayName: 'Test Master' },
            worklog: { worklogs: [] },
          },
        },
        changelog: {
          items: [
            {
              field: 'status',
              fromString: 'In Progress',
              toString: 'Review',
            },
          ],
        },
      };

      const result = await service.validateAndProcess(webhookData as any);

      expect(result.validated).toBe(false);
      expect(result.timeFound).toBe(false);
      expect(result.action).toBe('rejected');
    });

    it('should approve task with valid worklog', async () => {
      const webhookData = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-001',
          fields: {
            status: { name: 'Review' },
            summary: 'Стрижка клиента',
            assignee: { displayName: 'Test Master' },
            worklog: {
              worklogs: [
                {
                  timeSpentSeconds: 1800, // 30 minutes
                  started: '2023-09-25T10:00:00.000Z',
                  comment: 'Сделал стрижку',
                },
              ],
            },
          },
        },
        changelog: {
          items: [
            {
              field: 'status',
              fromString: 'In Progress',
              toString: 'Review',
            },
          ],
        },
      };

      mockHaircutReportService.processWebhook.mockResolvedValue({
        processed: true,
        analysisResult: 'success',
      });

      const result = await service.validateAndProcess(webhookData as any);

      expect(result.validated).toBe(true);
      expect(result.timeFound).toBe(true);
      expect(result.action).toBe('approved');
      expect(result.totalTimeSeconds).toBe(1800);
    });
  });
});
