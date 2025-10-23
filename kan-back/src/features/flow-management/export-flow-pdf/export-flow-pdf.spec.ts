import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, StreamableFile } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { ExportFlowPdfController } from './export-flow-pdf.controller';
import { ExportFlowPdfService } from './export-flow-pdf.service';
import { Flow } from '../../../entities/flow.entity';

describe('ExportFlowPdfController (E2E)', () => {
  let app: INestApplication;
  let flowRepository: Repository<Flow>;

  const mockFlow = {
    id: 'flow-123',
    name: 'Test Flow',
    description: 'Test description',
    status: 'active',
    definition: {
      blocks: [
        { id: 'block-1', type: 'start', data: {} },
        { id: 'block-2', type: 'action', data: { action: 'test' } },
      ],
      connections: [{ source: 'block-1', target: 'block-2' }],
    },
    metadata: { tags: ['test'] },
    createdBy: 'user-123',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-23'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportFlowPdfController],
      providers: [
        ExportFlowPdfService,
        {
          provide: getRepositoryToken(Flow),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    flowRepository = module.get<Repository<Flow>>(getRepositoryToken(Flow));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /flow-management/export-pdf/:id', () => {
    it('should export flow to PDF successfully', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(mockFlow as any);

      return request(app.getHttpServer())
        .get('/flow-management/export-pdf/flow-123')
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Buffer);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should return 404 if flow not found', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/flow-management/export-pdf/non-existent')
        .expect(404);
    });

    it('should set correct PDF headers', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(mockFlow as any);

      return request(app.getHttpServer())
        .get('/flow-management/export-pdf/flow-123')
        .expect('Content-Type', /application\/pdf/)
        .expect(
          'Content-Disposition',
          /attachment; filename="flow-export.pdf"/,
        );
    });
  });
});
