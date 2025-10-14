import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { GetBoardColumnsController } from './get-board-columns.controller';
import { GetBoardColumnsService } from './get-board-columns.service';

describe('GetBoardColumnsController (E2E)', () => {
  let app: INestApplication;
  let getBoardColumnsService: GetBoardColumnsService;

  const mockBoardInfo = {
    id: '123',
    name: 'Test Project Board',
    type: 'scrum',
    projectKey: 'TEST',
  };

  const mockColumns = [
    {
      id: 'to-do',
      name: 'To Do',
      statusIds: ['1', '10001'],
      isFirst: true,
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      statusIds: ['3'],
    },
    {
      id: 'done',
      name: 'Done',
      statusIds: ['10002'],
      isLast: true,
    },
  ];

  const mockGetBoardColumnsService = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      boardId: '123',
      message: 'Board columns retrieved successfully',
      boardInfo: mockBoardInfo,
      columns: mockColumns,
      totalColumns: 3,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [GetBoardColumnsController],
      providers: [
        {
          provide: GetBoardColumnsService,
          useValue: mockGetBoardColumnsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getBoardColumnsService = moduleFixture.get<GetBoardColumnsService>(
      GetBoardColumnsService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /jira/boards/:boardId/columns', () => {
    it('should successfully retrieve board columns', async () => {
      const response = await request(app.getHttpServer())
        .get('/jira/boards/123/columns')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('boardId', '123');
      expect(response.body).toHaveProperty('boardInfo');
      expect(response.body.boardInfo.name).toBe('Test Project Board');
      expect(response.body).toHaveProperty('columns');
      expect(response.body.columns).toHaveLength(3);
      expect(response.body).toHaveProperty('totalColumns', 3);

      // Проверяем структуру колонок
      const firstColumn = response.body.columns[0];
      expect(firstColumn).toHaveProperty('id', 'to-do');
      expect(firstColumn).toHaveProperty('name', 'To Do');
      expect(firstColumn).toHaveProperty('statusIds');
      expect(firstColumn).toHaveProperty('isFirst', true);

      // Проверяем что сервис был вызван с правильными параметрами
      expect(mockGetBoardColumnsService.execute).toHaveBeenCalledWith({
        boardId: '123',
      });
    });

    it('should handle board not found error', async () => {
      mockGetBoardColumnsService.execute.mockRejectedValueOnce(
        new Error('Board not found'),
      );

      await request(app.getHttpServer())
        .get('/jira/boards/nonexistent/columns')
        .expect(500); // Или 404 в зависимости от обработки ошибок
    });

    it('should validate board ID parameter', async () => {
      const response = await request(app.getHttpServer())
        .get('/jira/boards//columns') // Empty board ID
        .expect(404); // Route not found

      expect(response.body.message).toContain('Cannot GET');
    });

    it('should return proper column structure with all required fields', async () => {
      const response = await request(app.getHttpServer())
        .get('/jira/boards/123/columns')
        .expect(200);

      const columns = response.body.columns;

      // Проверяем что каждая колонка имеет необходимые поля
      columns.forEach((column: any) => {
        expect(column).toHaveProperty('id');
        expect(column).toHaveProperty('name');
        expect(column).toHaveProperty('statusIds');
        expect(Array.isArray(column.statusIds)).toBe(true);

        // Проверяем что есть индикаторы первой/последней колонки
        if (column.isFirst !== undefined) {
          expect(typeof column.isFirst).toBe('boolean');
        }
        if (column.isLast !== undefined) {
          expect(typeof column.isLast).toBe('boolean');
        }
      });
    });
  });
});
