import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { ConfigureAgentController } from './configure-agent.controller';
import { ConfigureAgentService } from './configure-agent.service';
import { CreateAgentService } from '../create-agent/create-agent.service';
import { aiAgentConfig } from '../../../config';

describe('ConfigureAgentController (E2E)', () => {
  let app: INestApplication;
  let createAgentService: CreateAgentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [aiAgentConfig],
        }),
      ],
      controllers: [ConfigureAgentController],
      providers: [ConfigureAgentService, CreateAgentService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    createAgentService = module.get<CreateAgentService>(CreateAgentService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should configure existing AI agent successfully', async () => {
    // First create an agent
    const createResult = await createAgentService.execute({
      name: 'Test Agent',
      instructions: 'Initial instructions',
    });

    const agentId = createResult.agentId;
    const configureDto = {
      name: 'Updated Test Agent',
      instructions: 'Updated instructions',
      temperature: 0.7,
      isActive: false,
    };

    return request(app.getHttpServer())
      .put(`/ai-agent/${agentId}/configure`)
      .send(configureDto)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('agentId', agentId);
        expect(res.body).toHaveProperty('message');
        expect(res.body.agent).toHaveProperty('name', 'Updated Test Agent');
        expect(res.body.agent).toHaveProperty(
          'instructions',
          'Updated instructions',
        );
        expect(res.body.agent).toHaveProperty('temperature', 0.7);
        expect(res.body.agent).toHaveProperty('isActive', false);
      });
  });

  it('should return 404 for non-existent agent', async () => {
    const nonExistentId = 'non-existent-id';
    const configureDto = {
      name: 'Updated Name',
    };

    return request(app.getHttpServer())
      .put(`/ai-agent/${nonExistentId}/configure`)
      .send(configureDto)
      .expect(404);
  });

  it('should return validation error for invalid temperature', async () => {
    // First create an agent
    const createResult = await createAgentService.execute({
      name: 'Test Agent',
      instructions: 'Initial instructions',
    });

    const configureDto = {
      temperature: 2.0, // Invalid temperature > 1.0
    };

    return request(app.getHttpServer())
      .put(`/ai-agent/${createResult.agentId}/configure`)
      .send(configureDto)
      .expect(400);
  });
});
