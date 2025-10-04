import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetReportHealthController } from './get-report-health.controller';
import { GetReportHealthService } from './get-report-health.service';

describe('GetReportHealthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetReportHealthController],
      providers: [GetReportHealthService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return health status', async () => {
    return request(app.getHttpServer())
      .get('/ai-reporting-agent/generate-report/health')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('status', 'healthy');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty(
          'service',
          'AI Reporting Agent - Generate Report',
        );
        expect(new Date(res.body.timestamp)).toBeInstanceOf(Date);
      });
  });

  it('should have correct response format', async () => {
    return request(app.getHttpServer())
      .get('/ai-reporting-agent/generate-report/health')
      .expect(200)
      .then((res) => {
        expect(typeof res.body.status).toBe('string');
        expect(typeof res.body.timestamp).toBe('string');
        expect(typeof res.body.service).toBe('string');
      });
  });
});
