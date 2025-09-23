import { JiraWebhookHandlerService } from './jira-webhook-handler.service';
import { JiraWebhookHandlerController } from './jira-webhook-handler.controller';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  JiraWebhookPayload,
  JiraWebhookEvent,
} from './jira-webhook-handler.interface';

describe('JiraWebhookHandlerService', () => {
  let service: JiraWebhookHandlerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JiraWebhookHandlerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'WEBHOOK_SECRET':
                  return 'test-secret';
                case 'app.baseUrl':
                  return 'http://localhost:3000';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<JiraWebhookHandlerService>(JiraWebhookHandlerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('processWebhook', () => {
    it('should process issue created webhook', async () => {
      const payload: JiraWebhookPayload = {
        webhookEvent: JiraWebhookEvent.ISSUE_CREATED,
        timestamp: Date.now(),
        issue: {
          id: '12345',
          key: 'TEST-123',
          self: 'https://example.atlassian.net/rest/api/3/issue/12345',
          fields: {
            summary: 'Сделать стрижку клиенту',
            status: {
              id: '1',
              name: 'To Do',
              statusCategory: {
                id: 2,
                key: 'new',
                name: 'New',
              },
            },
            created: '2025-09-23T10:00:00.000+0000',
            updated: '2025-09-23T10:00:00.000+0000',
            issuetype: {
              id: '10001',
              name: 'Task',
              iconUrl: 'https://example.com/icon.png',
            },
          },
        },
      };

      const result = await service.processWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.issueKey).toBe('TEST-123');
      expect(result.triggeredActions).toContain('haircut-analysis');
    });

    it('should handle status change webhook', async () => {
      const payload: JiraWebhookPayload = {
        webhookEvent: JiraWebhookEvent.ISSUE_UPDATED,
        timestamp: Date.now(),
        issue: {
          id: '12345',
          key: 'TEST-123',
          self: 'https://example.atlassian.net/rest/api/3/issue/12345',
          fields: {
            summary: 'Task summary',
            status: {
              id: '3',
              name: 'Done',
              statusCategory: {
                id: 3,
                key: 'done',
                name: 'Done',
              },
            },
            created: '2025-09-23T10:00:00.000+0000',
            updated: '2025-09-23T10:05:00.000+0000',
            issuetype: {
              id: '10001',
              name: 'Task',
              iconUrl: 'https://example.com/icon.png',
            },
          },
        },
        changelog: {
          id: '67890',
          items: [
            {
              field: 'status',
              fieldtype: 'jira',
              fromString: 'In Progress',
              toString: 'Done',
            },
          ],
        },
      };

      const result = await service.processWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.triggeredActions).toContain('completion-analysis');
    });

    it('should identify haircut-related tasks', async () => {
      const haircutPayload: JiraWebhookPayload = {
        webhookEvent: JiraWebhookEvent.ISSUE_CREATED,
        timestamp: Date.now(),
        issue: {
          id: '12345',
          key: 'TEST-123',
          self: 'https://example.atlassian.net/rest/api/3/issue/12345',
          fields: {
            summary: 'Окрашивание волос клиентке Марии',
            status: {
              id: '1',
              name: 'To Do',
              statusCategory: {
                id: 2,
                key: 'new',
                name: 'New',
              },
            },
            created: '2025-09-23T10:00:00.000+0000',
            updated: '2025-09-23T10:00:00.000+0000',
            issuetype: {
              id: '10001',
              name: 'Task',
              iconUrl: 'https://example.com/icon.png',
            },
          },
        },
      };

      const result = await service.processHaircutTaskWebhook(haircutPayload);

      expect(result.success).toBe(true);
      expect(result.triggeredActions).toContain('haircut-analysis');
    });

    it('should skip non-haircut tasks in specialized webhook', async () => {
      const regularPayload: JiraWebhookPayload = {
        webhookEvent: JiraWebhookEvent.ISSUE_CREATED,
        timestamp: Date.now(),
        issue: {
          id: '12345',
          key: 'TEST-123',
          self: 'https://example.atlassian.net/rest/api/3/issue/12345',
          fields: {
            summary: 'Fix database connection issue',
            status: {
              id: '1',
              name: 'To Do',
              statusCategory: {
                id: 2,
                key: 'new',
                name: 'New',
              },
            },
            created: '2025-09-23T10:00:00.000+0000',
            updated: '2025-09-23T10:00:00.000+0000',
            issuetype: {
              id: '10001',
              name: 'Task',
              iconUrl: 'https://example.com/icon.png',
            },
          },
        },
      };

      const result = await service.processHaircutTaskWebhook(regularPayload);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Not a haircut-related task');
      expect(result.triggeredActions).toContain('skipped');
    });
  });

  describe('validateWebhookSignature', () => {
    it('should skip validation when secret is not configured', async () => {
      // Mock empty secret
      jest.spyOn(configService, 'get').mockReturnValue('');

      const headers = {};
      const payload = { test: 'data' };

      // Should not throw
      await expect(
        service.validateWebhookSignature(headers, payload),
      ).resolves.toBeUndefined();
    });

    it('should throw error when signature is missing', async () => {
      const headers = {};
      const payload = { test: 'data' };

      await expect(
        service.validateWebhookSignature(headers, payload),
      ).rejects.toThrow('Missing webhook signature');
    });
  });
});
