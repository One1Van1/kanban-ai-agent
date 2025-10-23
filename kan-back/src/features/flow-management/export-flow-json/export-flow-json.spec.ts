import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { ExportFlowJsonController } from './export-flow-json.controller';
import { ExportFlowJsonService } from './export-flow-json.service';
import { Flow } from '../../../entities/flow.entity';

describe('ExportFlowJsonController (E2E)', () => {
  let app: INestApplication;
  let flowRepository: Repository<Flow>;

  const mockFlow = {
    id: 'flow-123',
    name: 'Test Flow',
    description: 'Test description',
    status: 'active',
    definition: { blocks: [], connections: [] },
    metadata: { tags: ['test'] },
    createdBy: 'user-123',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-23'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportFlowJsonController],
      providers: [
        ExportFlowJsonService,
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

  describe('GET /flow-management/export-json/:id', () => {
    it('should export flow successfully', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(mockFlow as any);

      return request(app.getHttpServer())
        .get('/flow-management/export-json/flow-123')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('flowId');
          expect(res.body).toHaveProperty('name');
          expect(res.body.flowId).toBe('flow-123');
          expect(res.body.name).toBe('Test Flow');
        });
    });

    it('should return 404 if flow not found', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/flow-management/export-json/non-existent')
        .expect(404);
    });

    it('should include export metadata', async () => {
      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(mockFlow as any);

      return request(app.getHttpServer())
        .get('/flow-management/export-json/flow-123')
        .expect(200)
        .then((res) => {
          expect(res.body.version).toBe('1.0.0');
          expect(res.body.exportedAt).toBeDefined();
          expect(res.body.definition).toBeDefined();
        });
    });
  });
});
