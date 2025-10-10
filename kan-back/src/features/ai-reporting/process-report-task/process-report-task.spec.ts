import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProcessReportTaskController } from './process-report-task.controller';
import { ProcessReportTaskService } from './process-report-task.service';
import { SearchTasksService } from '../../../jira/search-tasks/search-tasks.service';
import { AddTaskCommentService } from '../../../jira/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../../../jira/move-task/move-task.service';
import { GenerateReportService } from '../generate-report/generate-report.service';

describe('ProcessReportTaskController (E2E)', () => {
  let app: INestApplication;

  const mockSearchTasksService = {
    searchTasksByJql: jest.fn(),
  };

  const mockAddTaskCommentService = {
    addCommentToTask: jest.fn(),
  };

  const mockMoveTaskService = {
    moveTaskToColumn: jest.fn(),
  };

  const mockGenerateReportService = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessReportTaskController],
      providers: [
        ProcessReportTaskService,
        {
          provide: SearchTasksService,
          useValue: mockSearchTasksService,
        },
        {
          provide: AddTaskCommentService,
          useValue: mockAddTaskCommentService,
        },
        {
          provide: MoveTaskService,
          useValue: mockMoveTaskService,
        },
        {
          provide: GenerateReportService,
          useValue: mockGenerateReportService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process report task successfully', async () => {
    // Mock task assigned to AI-Report-maker
    mockSearchTasksService.searchTasksByJql.mockResolvedValue({
      issues: [
        {
          key: 'KAN-33',
          fields: {
            description: 'отчёт за сегодня',
            assignee: {
              displayName: 'AI-Report-maker',
            },
            comment: {
              comments: [], // No existing report comments
            },
          },
        },
      ],
    });

    // Mock report generation
    mockGenerateReportService.execute.mockResolvedValue({
      statistics: {
        totalHaircuts: 5,
        averageScore: 8.2,
        dateRange: { startDate: '2025-10-04', endDate: '2025-10-04' },
        genderAnalysis: {
          male: { count: 2, averageScore: 8.0 },
          female: { count: 3, averageScore: 8.3 },
        },
        dayOfWeekAnalysis: {},
      },
      recommendations: ['Хорошее качество работы'],
    });

    mockAddTaskCommentService.addCommentToTask.mockResolvedValue({});
    mockMoveTaskService.moveTaskToColumn.mockResolvedValue({});

    const requestDto = {
      taskKey: 'KAN-33',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report/process-task')
      .send(requestDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('processed successfully');
        expect(mockAddTaskCommentService.addCommentToTask).toHaveBeenCalled();
        expect(mockMoveTaskService.moveTaskToColumn).toHaveBeenCalledWith(
          'KAN-33',
          'Done',
        );
      });
  });

  it('should skip task not assigned to AI-Report-maker', async () => {
    mockSearchTasksService.searchTasksByJql.mockResolvedValue({
      issues: [
        {
          key: 'KAN-33',
          fields: {
            description: 'отчёт за сегодня',
            assignee: {
              displayName: 'Other User',
            },
          },
        },
      ],
    });

    const requestDto = {
      taskKey: 'KAN-33',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report/process-task')
      .send(requestDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.message).toContain('not assigned to AI-Report-maker');
        expect(mockGenerateReportService.execute).not.toHaveBeenCalled();
      });
  });

  it('should handle validation errors', async () => {
    const invalidDto = {
      taskKey: '', // Empty task key should fail validation
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report/process-task')
      .send(invalidDto)
      .expect(400);
  });

  it('should handle task not found', async () => {
    mockSearchTasksService.searchTasksByJql.mockResolvedValue({
      issues: [],
    });

    const requestDto = {
      taskKey: 'NONEXISTENT-1',
    };

    return request(app.getHttpServer())
      .post('/ai-reporting-agent/generate-report/process-task')
      .send(requestDto)
      .expect(500);
  });
});
