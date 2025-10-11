import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAgentsByBoardTypeController } from './get-agents-by-board-type.controller';
import { GetAgentsByBoardTypeService } from './get-agents-by-board-type.service';
import { Agent } from '../../../entities/agent.entity';
import { BoardType } from '../../../types/board-integration.interface';

describe('GetAgentsByBoardTypeController (E2E)', () => {
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
      controllers: [GetAgentsByBoardTypeController],
      providers: [GetAgentsByBoardTypeService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty list for board type with no agents', async () => {
    return request(app.getHttpServer())
      .get('/agents/by-board-type/jira')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('agents');
        expect(res.body).toHaveProperty('boardType', 'jira');
        expect(res.body).toHaveProperty('total');
        expect(res.body.agents).toEqual([]);
        expect(res.body.total).toBe(0);
      });
  });

  it('should return agents for specific board type', async () => {
    const agentRepository = module.get('AgentRepository');

    // Create test agents
    await agentRepository.save([
      {
        name: 'Jira Agent 1',
        description: 'First Jira Agent',
        status: 'active',
        boardType: BoardType.JIRA,
      },
      {
        name: 'Jira Agent 2',
        description: 'Second Jira Agent',
        status: 'active',
        boardType: BoardType.JIRA,
      },
      {
        name: 'Trello Agent',
        description: 'Trello Agent',
        status: 'active',
        boardType: BoardType.TRELLO,
      },
    ]);

    return request(app.getHttpServer())
      .get('/agents/by-board-type/jira')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('agents');
        expect(res.body).toHaveProperty('boardType', 'jira');
        expect(res.body).toHaveProperty('total', 2);
        expect(res.body.agents).toHaveLength(2);
        expect(res.body.agents[0]).toHaveProperty('boardType', 'jira');
      });
  });
});
