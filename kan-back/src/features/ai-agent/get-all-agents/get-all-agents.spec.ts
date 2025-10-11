import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllAgentsController } from './get-all-agents.controller';
import { GetAllAgentsService } from './get-all-agents.service';
import { Agent } from '../../../entities/agent.entity';

describe('GetAllAgentsController (E2E)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Agent],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Agent]),
      ],
      controllers: [GetAllAgentsController],
      providers: [GetAllAgentsService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty list when no agents exist', async () => {
    return request(app.getHttpServer())
      .get('/agents')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('agents');
        expect(res.body).toHaveProperty('total');
        expect(res.body.agents).toEqual([]);
        expect(res.body.total).toBe(0);
      });
  });

  it('should return agents list with proper structure', async () => {
    const agentRepository = module.get('AgentRepository');

    // Create test agent
    await agentRepository.save({
      name: 'Test Agent',
      description: 'Test Description',
      status: 'active',
    });

    return request(app.getHttpServer())
      .get('/agents')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('agents');
        expect(res.body).toHaveProperty('total');
        expect(res.body.total).toBe(1);
        expect(res.body.agents[0]).toHaveProperty('id');
        expect(res.body.agents[0]).toHaveProperty('name');
        expect(res.body.agents[0]).toHaveProperty('status');
      });
  });
});
