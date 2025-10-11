import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAgentByIdController } from './get-agent-by-id.controller';
import { GetAgentByIdService } from './get-agent-by-id.service';
import { Agent } from '../../../entities/agent.entity';

describe('GetAgentByIdController (E2E)', () => {
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
      controllers: [GetAgentByIdController],
      providers: [GetAgentByIdService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 404 for non-existent agent', async () => {
    return request(app.getHttpServer())
      .get('/agents/non-existent-id')
      .expect(404);
  });

  it('should return agent details for valid ID', async () => {
    const agentRepository = module.get('AgentRepository');

    // Create test agent
    const savedAgent = await agentRepository.save({
      name: 'Test Agent',
      description: 'Test Description',
      status: 'active',
    });

    return request(app.getHttpServer())
      .get(`/agents/${savedAgent.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Agent');
        expect(res.body).toHaveProperty('description', 'Test Description');
        expect(res.body).toHaveProperty('status', 'active');
        expect(res.body).toHaveProperty('instructions');
        expect(res.body).toHaveProperty('boardIntegrations');
      });
  });
});
