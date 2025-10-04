import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { CreateAgentController } from './create-agent.controller';
import { CreateAgentService } from './create-agent.service';
import { aiAgentConfig } from '../../../config';

describe('CreateAgentController (E2E)', () => {
  let app: INestApplication;
  let service: CreateAgentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [aiAgentConfig],
        }),
      ],
      controllers: [CreateAgentController],
      providers: [CreateAgentService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    service = module.get<CreateAgentService>(CreateAgentService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create AI agent successfully', async () => {
    const createAgentDto = {
      name: 'Test Agent',
      description: 'Test agent for E2E testing',
      instructions: 'Test instructions for the agent',
      model: 'claude-3-haiku-20240307',
      temperature: 0.3,
      maxTokens: 1000,
      isActive: true,
    };

    return request(app.getHttpServer())
      .post('/ai-agent')
      .send(createAgentDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('agentId');
        expect(res.body).toHaveProperty('name', 'Test Agent');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('agent');
        expect(res.body.agent).toHaveProperty('id');
        expect(res.body.agent).toHaveProperty('name', 'Test Agent');
        expect(res.body.agent).toHaveProperty(
          'instructions',
          'Test instructions for the agent',
        );
        expect(res.body.agent).toHaveProperty('isActive', true);
      });
  });

  it('should return validation error for missing required fields', async () => {
    const invalidDto = {
      name: '', // Empty name should fail validation
    };

    return request(app.getHttpServer())
      .post('/ai-agent')
      .send(invalidDto)
      .expect(400);
  });

  it('should return validation error for invalid temperature', async () => {
    const invalidDto = {
      name: 'Test Agent',
      instructions: 'Test instructions',
      temperature: 2.0, // Temperature > 1.0 should fail
    };

    return request(app.getHttpServer())
      .post('/ai-agent')
      .send(invalidDto)
      .expect(400);
  });

  it('should create agent with default values when optional fields are omitted', async () => {
    const minimalDto = {
      name: 'Minimal Agent',
      instructions: 'Minimal instructions',
    };

    return request(app.getHttpServer())
      .post('/ai-agent')
      .send(minimalDto)
      .expect(201)
      .then((res) => {
        expect(res.body.agent).toHaveProperty('model');
        expect(res.body.agent).toHaveProperty('temperature');
        expect(res.body.agent).toHaveProperty('maxTokens');
        expect(res.body.agent).toHaveProperty('isActive', true);
      });
  });
});
