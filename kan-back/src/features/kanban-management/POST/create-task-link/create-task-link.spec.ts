import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTaskLinkController } from './create-task-link.controller';
import { CreateTaskLinkService } from './create-task-link.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('CreateTaskLinkController (E2E)', () => {
  let app: INestApplication;
  let controller: CreateTaskLinkController;

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
      controllers: [CreateTaskLinkController],
      providers: [CreateTaskLinkService],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<CreateTaskLinkController>(
      CreateTaskLinkController,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kanban/tasks/:id/links (POST)', () => {
    it('should create a new task link', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const linkData = {
        targetTaskId: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        linkType: 'blocks',
        description: 'This task blocks the target task',
        createdBy: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${sourceTaskId}/links`)
        .send(linkData)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('message');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('sourceTaskId');
          expect(res.body.data).toHaveProperty('targetTaskId');
          expect(res.body.data).toHaveProperty('linkType');
          expect(res.body.data).toHaveProperty('createdBy');
          expect(res.body.data).toHaveProperty('createdAt');
          expect(res.body.data).toHaveProperty('isActive');
          expect(res.body.data.sourceTaskId).toBe(sourceTaskId);
          expect(res.body.data.targetTaskId).toBe(linkData.targetTaskId);
          expect(res.body.data.linkType).toBe(linkData.linkType);
          expect(res.body.data.createdBy).toBe(linkData.createdBy);
          expect(res.body.data.isActive).toBe(true);
        });
    });

    it('should handle invalid source task ID format', async () => {
      const linkData = {
        targetTaskId: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        linkType: 'blocks',
        createdBy: 'agent-001',
      };

      return request(app.getHttpServer())
        .post('/kanban/tasks/invalid-uuid/links')
        .send(linkData)
        .expect(400);
    });

    it('should validate required fields', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        linkType: 'blocks',
        // Missing targetTaskId and createdBy
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${sourceTaskId}/links`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate link type enum', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        targetTaskId: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        linkType: 'invalid_link_type',
        createdBy: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${sourceTaskId}/links`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate target task ID format', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const invalidData = {
        targetTaskId: 'invalid-uuid',
        linkType: 'blocks',
        createdBy: 'agent-001',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${sourceTaskId}/links`)
        .send(invalidData)
        .expect(400);
    });

    it('should create link with different link types', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';
      const linkTypes = ['relates_to', 'depends_on', 'duplicates'];

      for (const linkType of linkTypes) {
        const linkData = {
          targetTaskId: `f47ac10b-58cc-4372-a567-0e02b2c3d48${linkTypes.indexOf(linkType) + 2}`,
          linkType,
          createdBy: 'agent-001',
        };

        await request(app.getHttpServer())
          .post(`/kanban/tasks/${sourceTaskId}/links`)
          .send(linkData)
          .expect(201)
          .then((res) => {
            expect(res.body.data.linkType).toBe(linkType);
          });
      }
    });

    it('should handle link creation without description', async () => {
      const sourceTaskId = 'f47ac10b-58cc-4372-a567-0e02b2c3d485';
      const linkData = {
        targetTaskId: 'f47ac10b-58cc-4372-a567-0e02b2c3d486',
        linkType: 'relates_to',
        createdBy: 'agent-002',
      };

      return request(app.getHttpServer())
        .post(`/kanban/tasks/${sourceTaskId}/links`)
        .send(linkData)
        .expect(201)
        .then((res) => {
          expect(res.body.data.description).toBeUndefined();
        });
    });
  });
});
