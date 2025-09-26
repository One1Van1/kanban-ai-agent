import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';
import { ProcessWebhookBeforeAfterController } from './process-webhook-before-after.controller';

describe('ProcessWebhookBeforeAfterService', () => {
  let service: ProcessWebhookBeforeAfterService;
  let controller: ProcessWebhookBeforeAfterController;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'app.baseUrl': 'http://localhost:3000',
        'jira.baseUrl': 'https://test.atlassian.net',
        'jira.email': 'test@example.com',
        'jira.apiToken': 'test-token',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessWebhookBeforeAfterController],
      providers: [
        ProcessWebhookBeforeAfterService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ProcessWebhookBeforeAfterService>(
      ProcessWebhookBeforeAfterService,
    );
    controller = module.get<ProcessWebhookBeforeAfterController>(
      ProcessWebhookBeforeAfterController,
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('validateClaudeConditions', () => {
    it('should accept haircut-related tasks in Review status', () => {
      const webhookDto = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-123',
          id: '123',
          fields: {
            summary: 'Женская стрижка каскад',
            description: 'Стрижка для клиентки',
            status: { name: 'Review', id: '3' },
            assignee: { displayName: 'Test User', accountId: 'acc-123' },
          },
        },
      };

      const result = service['validateClaudeConditions'](webhookDto);
      expect(result.shouldProcess).toBe(true);
      expect(result.reason).toBe('All conditions met for Claude analysis');
    });

    it('should reject non-haircut tasks', () => {
      const webhookDto = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-123',
          id: '123',
          fields: {
            summary: 'Fix bug in system',
            description: 'Technical issue',
            status: { name: 'Review', id: '3' },
          },
        },
      };

      const result = service['validateClaudeConditions'](webhookDto);
      expect(result.shouldProcess).toBe(false);
      expect(result.reason).toBe(
        'Task does not contain haircut-related keywords',
      );
    });

    it('should reject tasks not in trigger statuses', () => {
      const webhookDto = {
        webhookEvent: 'jira:issue_updated',
        issue: {
          key: 'TEST-123',
          id: '123',
          fields: {
            summary: 'Женская стрижка',
            status: { name: 'In Progress', id: '2' },
          },
        },
      };

      const result = service['validateClaudeConditions'](webhookDto);
      expect(result.shouldProcess).toBe(false);
      expect(result.reason).toBe(
        'Status In Progress not in trigger list [Review, Testing, Done]',
      );
    });
  });

  describe('controller endpoints', () => {
    it('should return health status', async () => {
      const result = await controller.getHealth();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return webhook configuration', async () => {
      const result = await controller.getConfig();
      expect(result).toHaveProperty('triggerStatuses');
      expect(result).toHaveProperty('haircutKeywords');
      expect(result.triggerStatuses).toContain('Review');
      expect(result.haircutKeywords).toContain('стрижк');
    });
  });

  describe('service health check', () => {
    it('should return healthy status', async () => {
      const result = await service.getServiceHealth();
      expect(result.status).toBe('healthy');
      expect(result.claudeEndpoint).toBe(
        'http://localhost:3000/photo-analysis-agent/analyze-before-after-photos',
      );
    });
  });
});
