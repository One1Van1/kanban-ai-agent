import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetBoardSummaryController } from './get-board-summary.controller';
import { GetBoardSummaryService } from './get-board-summary.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('GetBoardSummaryController (E2E)', () => {
  let app: INestApplication;
  let controller: GetBoardSummaryController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TaskHistory],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TaskHistory]),
      ],
      controllers: [GetBoardSummaryController],
      providers: [GetBoardSummaryService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<GetBoardSummaryController>(
      GetBoardSummaryController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/board/summary (GET)', () => {
    it('should return board summary with basic statistics', async () => {
      return request(app.getHttpServer())
        .get('/kanban/board/summary')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('boardId');
          expect(res.body.data).toHaveProperty('totalTasks');
          expect(res.body.data).toHaveProperty('activeTasks');
          expect(res.body.data).toHaveProperty('completedTasks');
          expect(res.body.data).toHaveProperty('columns');
          expect(res.body.data).toHaveProperty('priorities');
          expect(res.body.data).toHaveProperty('lastUpdated');
          expect(Array.isArray(res.body.data.columns)).toBe(true);
          expect(Array.isArray(res.body.data.priorities)).toBe(true);
        });
    });

    it('should return board summary with specific board ID', async () => {
      const boardId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

      return request(app.getHttpServer())
        .get('/kanban/board/summary')
        .query({ boardId })
        .expect(200)
        .then((res) => {
          expect(res.body.data.boardId).toBe(boardId);
        });
    });

    it('should return detailed statistics when requested', async () => {
      return request(app.getHttpServer())
        .get('/kanban/board/summary')
        .query({ includeDetails: true })
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveProperty('avgTasksPerColumn');
          expect(res.body.data).toHaveProperty('tasksCreatedToday');
          expect(res.body.data).toHaveProperty('tasksCompletedToday');
          expect(res.body.data).toHaveProperty('overdueTasks');
          expect(res.body.data).toHaveProperty('completionRate');
        });
    });

    it('should return columns with correct structure', async () => {
      return request(app.getHttpServer())
        .get('/kanban/board/summary')
        .expect(200)
        .then((res) => {
          const firstColumn = res.body.data.columns[0];
          expect(firstColumn).toHaveProperty('columnId');
          expect(firstColumn).toHaveProperty('name');
          expect(firstColumn).toHaveProperty('taskCount');
          expect(firstColumn).toHaveProperty('color');
        });
    });

    it('should return priorities with correct structure', async () => {
      return request(app.getHttpServer())
        .get('/kanban/board/summary')
        .expect(200)
        .then((res) => {
          const firstPriority = res.body.data.priorities[0];
          expect(firstPriority).toHaveProperty('priority');
          expect(firstPriority).toHaveProperty('name');
          expect(firstPriority).toHaveProperty('taskCount');
          expect(firstPriority).toHaveProperty('color');
        });
    });
  });
});
