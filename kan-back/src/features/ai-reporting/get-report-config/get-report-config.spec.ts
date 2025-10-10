import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetReportConfigController } from './get-report-config.controller';
import { GetReportConfigService } from './get-report-config.service';

describe('GetReportConfigController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetReportConfigController],
      providers: [GetReportConfigService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return configuration', async () => {
    return request(app.getHttpServer())
      .get('/ai-reporting-agent/generate-report/config')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty(
          'service',
          'AI Reporting Agent - Generate Report',
        );
        expect(res.body).toHaveProperty('supportedDateFormats');
        expect(res.body).toHaveProperty('defaultDateRange', 'last 7 days');
        expect(res.body).toHaveProperty('reportTypes');
        expect(Array.isArray(res.body.supportedDateFormats)).toBe(true);
        expect(Array.isArray(res.body.reportTypes)).toBe(true);
      });
  });

  it('should have expected date formats', async () => {
    return request(app.getHttpServer())
      .get('/ai-reporting-agent/generate-report/config')
      .expect(200)
      .then((res) => {
        expect(res.body.supportedDateFormats).toContain('со вчера до сегодня');
        expect(res.body.supportedDateFormats).toContain('за прошлую неделю');
        expect(res.body.supportedDateFormats).toContain(
          'DD.MM.YYYY - DD.MM.YYYY',
        );
      });
  });

  it('should have expected report types', async () => {
    return request(app.getHttpServer())
      .get('/ai-reporting-agent/generate-report/config')
      .expect(200)
      .then((res) => {
        expect(res.body.reportTypes).toContain('haircut_statistics');
        expect(res.body.reportTypes).toContain('quality_analysis');
        expect(res.body.reportTypes).toContain('performance_trends');
        expect(res.body.reportTypes).toContain('recommendations');
      });
  });
});
