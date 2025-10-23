import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { ImportFlowController } from './import-flow.controller';
import { ImportFlowService } from './import-flow.service';
import { Flow } from '../../../entities/flow.entity';
import { ImportMode } from './import-flow.body.dto';

describe('ImportFlowController (E2E)', () => {
  let app: INestApplication;
  let flowRepository: Repository<Flow>;

  const mockFlow = {
    id: 'flow-123',
    name: 'Existing Flow',
    description: 'Test description',
    status: 'active',
    definition: { blocks: [], connections: [] },
    metadata: {},
    createdBy: 'user-123',
    updatedBy: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportFlowController],
      providers: [
        ImportFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
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

  describe('POST /flow-management/import', () => {
    it('should create new flow when importMode is CREATE_NEW', async () => {
      const importData = {
        version: '1.0.0',
        name: 'New Flow',
        description: 'Imported flow',
        status: 'draft',
        definition: { blocks: [], connections: [] },
        importMode: ImportMode.CREATE_NEW,
        createdBy: 'user-123',
      };

      const newFlow = { ...mockFlow, id: 'new-flow-123', name: 'New Flow' };

      jest.spyOn(flowRepository, 'create').mockReturnValue(newFlow as any);
      jest.spyOn(flowRepository, 'save').mockResolvedValue(newFlow as any);

      return request(app.getHttpServer())
        .post('/flow-management/import')
        .send(importData)
        .expect(201)
        .then((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.isNewFlow).toBe(true);
          expect(res.body.importMode).toBe(ImportMode.CREATE_NEW);
        });
    });

    it('should replace existing flow when importMode is REPLACE_EXISTING', async () => {
      const importData = {
        version: '1.0.0',
        name: 'Updated Flow',
        description: 'Updated description',
        status: 'active',
        definition: { blocks: [], connections: [] },
        importMode: ImportMode.REPLACE_EXISTING,
        flowIdToReplace: 'flow-123',
        createdBy: 'user-123',
      };

      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(mockFlow as any);
      jest
        .spyOn(flowRepository, 'save')
        .mockResolvedValue({ ...mockFlow, name: 'Updated Flow' } as any);

      return request(app.getHttpServer())
        .post('/flow-management/import')
        .send(importData)
        .expect(201)
        .then((res) => {
          expect(res.body.status).toBe('success');
          expect(res.body.isNewFlow).toBe(false);
          expect(res.body.importMode).toBe(ImportMode.REPLACE_EXISTING);
        });
    });

    it('should return 400 for unsupported version', async () => {
      const importData = {
        version: '99.9.9',
        name: 'Flow',
        status: 'draft',
        definition: { blocks: [], connections: [] },
      };

      return request(app.getHttpServer())
        .post('/flow-management/import')
        .send(importData)
        .expect(400);
    });

    it('should return 400 when flowIdToReplace is missing in REPLACE mode', async () => {
      const importData = {
        version: '1.0.0',
        name: 'Flow',
        status: 'draft',
        definition: { blocks: [], connections: [] },
        importMode: ImportMode.REPLACE_EXISTING,
      };

      return request(app.getHttpServer())
        .post('/flow-management/import')
        .send(importData)
        .expect(400);
    });

    it('should return 404 when flow to replace not found', async () => {
      const importData = {
        version: '1.0.0',
        name: 'Flow',
        status: 'draft',
        definition: { blocks: [], connections: [] },
        importMode: ImportMode.REPLACE_EXISTING,
        flowIdToReplace: 'non-existent',
      };

      jest.spyOn(flowRepository, 'findOne').mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/flow-management/import')
        .send(importData)
        .expect(404);
    });
  });
});
