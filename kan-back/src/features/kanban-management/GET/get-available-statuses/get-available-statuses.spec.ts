import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetAvailableStatusesController } from './get-available-statuses.controller';
import { GetAvailableStatusesService } from './get-available-statuses.service';

describe('GetAvailableStatusesController (E2E)', () => {
  let app: INestApplication;
  let controller: GetAvailableStatusesController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetAvailableStatusesController],
      providers: [GetAvailableStatusesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<GetAvailableStatusesController>(
      GetAvailableStatusesController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/statuses (GET)', () => {
    it('should return all available statuses and transitions', async () => {
      return request(app.getHttpServer())
        .get('/kanban/statuses')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('statuses');
          expect(res.body.data).toHaveProperty('transitions');
          expect(res.body.data).toHaveProperty('defaultStatus');
          expect(res.body.data).toHaveProperty('totalStatuses');
          expect(Array.isArray(res.body.data.statuses)).toBe(true);
          expect(Array.isArray(res.body.data.transitions)).toBe(true);
          expect(res.body.data.statuses.length).toBeGreaterThan(0);
        });
    });

    it('should return statuses with correct structure', async () => {
      return request(app.getHttpServer())
        .get('/kanban/statuses')
        .expect(200)
        .then((res) => {
          const firstStatus = res.body.data.statuses[0];
          expect(firstStatus).toHaveProperty('id');
          expect(firstStatus).toHaveProperty('name');
          expect(firstStatus).toHaveProperty('description');
          expect(firstStatus).toHaveProperty('color');
          expect(firstStatus).toHaveProperty('category');
          expect(firstStatus).toHaveProperty('order');
          expect(firstStatus).toHaveProperty('isInitial');
          expect(firstStatus).toHaveProperty('isFinal');
        });
    });

    it('should return transitions with correct structure', async () => {
      return request(app.getHttpServer())
        .get('/kanban/statuses')
        .expect(200)
        .then((res) => {
          const firstTransition = res.body.data.transitions[0];
          expect(firstTransition).toHaveProperty('from');
          expect(firstTransition).toHaveProperty('to');
          expect(firstTransition).toHaveProperty('name');
        });
    });

    it('should return default status', async () => {
      return request(app.getHttpServer())
        .get('/kanban/statuses')
        .expect(200)
        .then((res) => {
          expect(res.body.data.defaultStatus).toBe('todo');
          expect(res.body.data.totalStatuses).toBe(5);
        });
    });
  });
});
