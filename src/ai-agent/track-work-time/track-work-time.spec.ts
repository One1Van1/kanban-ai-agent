import { Test, TestingModule } from '@nestjs/testing';
import { TrackWorkTimeService } from './track-work-time.service';
import { JiraTimeService } from './jira-time.service';
import { ConfigService } from '@nestjs/config';

describe('TrackWorkTimeService', () => {
  let service: TrackWorkTimeService;
  let jiraTimeService: JiraTimeService;

  // Mock данные для тестов
  const mockTaskInfo = {
    summary: 'Обычная стрижка клиента',
    created: '2025-09-26T08:00:00.000Z',
    updated: '2025-09-26T10:30:00.000Z',
    status: { name: 'Done', id: '10004' },
  };

  const mockStatusTransitions = [
    {
      statusId: '10002',
      statusName: 'In Progress',
      timestamp: '2025-09-26T08:30:00.000Z',
      author: 'john.doe',
    },
    {
      statusId: '10003',
      statusName: 'Review',
      timestamp: '2025-09-26T10:00:00.000Z',
      author: 'john.doe',
    },
    {
      statusId: '10004',
      statusName: 'Done',
      timestamp: '2025-09-26T10:30:00.000Z',
      author: 'manager',
    },
  ];

  const mockWorklogs = [
    {
      id: '12345',
      author: { displayName: 'John Doe' },
      started: '2025-09-26T08:30:00.000Z',
      timeSpentSeconds: 5400, // 90 minutes
      comment: 'Работал над стрижкой',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackWorkTimeService,
        {
          provide: JiraTimeService,
          useValue: {
            getTaskInfo: jest.fn().mockResolvedValue(mockTaskInfo),
            getStatusTransitions: jest
              .fn()
              .mockResolvedValue(mockStatusTransitions),
            getTaskWorklog: jest.fn().mockResolvedValue(mockWorklogs),
            getTaskChangelog: jest.fn().mockResolvedValue([]),
            healthCheck: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, any> = {
                'jira.baseUrl': 'https://test.atlassian.net',
                'jira.email': 'test@example.com',
                'jira.apiToken': 'test-token',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TrackWorkTimeService>(TrackWorkTimeService);
    jiraTimeService = module.get<JiraTimeService>(JiraTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWorkTimeTracking', () => {
    it('should return complete work time tracking data', async () => {
      const result = await service.getWorkTimeTracking('TEST-123');

      expect(result.taskKey).toBe('TEST-123');
      expect(result.totalMinutes).toBe(90); // From worklog
      expect(result.statusHistory).toHaveLength(3);
      expect(result.worklogEntries).toHaveLength(1);
      expect(result.efficiency).toBeDefined();
      expect(result.efficiency.efficiency).toBe('good'); // 90 min for обычная стрижка is good
    });

    it('should handle tasks without worklogs', async () => {
      jest.spyOn(jiraTimeService, 'getTaskWorklog').mockResolvedValue([]);

      const result = await service.getWorkTimeTracking('TEST-123');

      expect(result.totalMinutes).toBeGreaterThan(0); // Should use status time
      expect(result.worklogEntries).toHaveLength(0);
    });
  });

  describe('getStatusHistory', () => {
    it('should return status history with durations', async () => {
      const result = await service.getStatusHistory('TEST-123');

      expect(result).toHaveLength(3);
      expect(result[0].statusName).toBe('In Progress');
      expect(result[0].durationMinutes).toBeGreaterThan(0);
      expect(result[2].statusName).toBe('Done');
      expect(result[2].exitedAt).toBeNull(); // Current status
    });
  });

  describe('getWorklogEntries', () => {
    it('should return formatted worklog entries', async () => {
      const result = await service.getWorklogEntries('TEST-123');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('12345');
      expect(result[0].author).toBe('John Doe');
      expect(result[0].timeSpentMinutes).toBe(90);
    });
  });

  describe('analyzeTimeEfficiency', () => {
    it('should analyze efficiency for regular haircut correctly', async () => {
      const result = await service.analyzeTimeEfficiency(
        45,
        'Обычная стрижка клиента',
      );

      expect(result.efficiency).toBe('good'); // 45 min is optimal for regular
      expect(result.expectedRange).toBe('30-60 мин');
      expect(result.efficiencyPercentage).toBe(100); // 45/45 * 100
    });

    it('should detect fast haircut and analyze accordingly', async () => {
      const result = await service.analyzeTimeEfficiency(
        20,
        'Быстрая стрижка под насадку',
      );

      expect(result.efficiency).toBe('good'); // 20 min is good for fast haircut
      expect(result.expectedRange).toBe('15-30 мин');
    });

    it('should mark slow performance correctly', async () => {
      const result = await service.analyzeTimeEfficiency(
        150,
        'Обычная стрижка',
      );

      expect(result.efficiency).toBe('slow'); // 150 min is too much
      expect(result.recommendations).toContain('Работа выполнена медленно');
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when Jira is available', async () => {
      const result = await service.healthCheck();

      expect(result.status).toBe('healthy');
      expect(result.jira).toBe(true);
    });

    it('should return degraded status when Jira is unavailable', async () => {
      jest.spyOn(jiraTimeService, 'healthCheck').mockResolvedValue(false);

      const result = await service.healthCheck();

      expect(result.status).toBe('degraded');
      expect(result.jira).toBe(false);
    });
  });
});
