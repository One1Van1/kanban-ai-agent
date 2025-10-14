import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ExecuteFlowController } from './execute-flow.controller';
import { ExecuteFlowService } from './execute-flow.service';
import { ExecuteAgentActionService } from '../execute-agent-action/execute-agent-action.service';
import { AgentActionResult } from '../execute-agent-action/execute-agent-action.response.dto';

describe('ExecuteFlowController (E2E)', () => {
  let app: INestApplication;
  let executeFlowService: ExecuteFlowService;

  const mockAgentResult = {
    executionId: 'test-execution-123',
    agentId: 'flow-executor-agent',
    taskId: 'PROJ-123',
    result: AgentActionResult.SUCCESS,
    actions: [
      {
        actionType: 'comment_added',
        description: 'Added comment to task',
        data: { commentId: 'comment-123' },
      },
    ],
    summary: 'Flow executed successfully',
    executionTimeMs: 1500,
    executedAt: new Date(),
    metadata: {
      flowVariables: { client_photos: [] },
    },
  };

  const mockExecuteAgentActionService = {
    execute: jest.fn().mockResolvedValue(mockAgentResult),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ExecuteFlowController],
      providers: [
        ExecuteFlowService,
        {
          provide: ExecuteAgentActionService,
          useValue: mockExecuteAgentActionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    executeFlowService =
      moduleFixture.get<ExecuteFlowService>(ExecuteFlowService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /ai-agent/execute-flow', () => {
    const validFlowRequest = {
      flowDefinition: {
        id: 'flow-123',
        name: 'Hair Analysis Flow',
        description: 'Automated hair analysis workflow',
        version: '1.0.0',
        nodes: [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: {
              type: 'jira_move',
              name: 'Jira Move Trigger',
              config: {
                boardType: 'jira',
                event: 'card_moved',
                targetColumn: 'На проверку',
              },
            },
          },
          {
            id: 'context-1',
            type: 'context',
            position: { x: 200, y: 100 },
            data: {
              type: 'extract_files',
              name: 'Extract Client Photos',
              config: {
                variableName: 'client_photos',
                source: 'card_files',
                filterByUser: 'client',
              },
            },
          },
          {
            id: 'action-1',
            type: 'action',
            position: { x: 300, y: 100 },
            data: {
              type: 'comment',
              name: 'Ask for Photos',
              config: {
                text: 'Загрузите фотографии стрижки',
              },
            },
          },
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'trigger-1',
            target: 'context-1',
          },
          {
            id: 'edge-2',
            source: 'context-1',
            target: 'action-1',
          },
        ],
        variables: [],
        settings: {},
      },
      taskKey: 'PROJ-123',
      triggerContext: {
        columnName: 'На проверку',
        triggerType: 'column_change',
        taskData: {
          summary: 'Стрижка клиента',
          assignee: 'hairdresser@salon.com',
        },
      },
    };

    it('should successfully execute a flow and return execution result', async () => {
      const response = await request(app.getHttpServer())
        .post('/ai-agent/execute-flow')
        .send(validFlowRequest)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('executionId');
      expect(response.body).toHaveProperty('taskKey', 'PROJ-123');
      expect(response.body).toHaveProperty('executionResult');
      expect(response.body.executionResult).toHaveProperty(
        'flowId',
        'flow-123',
      );
      expect(response.body.executionResult).toHaveProperty(
        'status',
        'completed',
      );
      expect(response.body.executionResult.steps).toHaveLength(3);
    });

    it('should return bad request for invalid flow definition', async () => {
      const invalidRequest = {
        ...validFlowRequest,
        flowDefinition: {}, // Invalid empty flow
      };

      await request(app.getHttpServer())
        .post('/ai-agent/execute-flow')
        .send(invalidRequest)
        .expect(400);
    });

    it('should return bad request for missing task key', async () => {
      const invalidRequest = {
        ...validFlowRequest,
        taskKey: '', // Empty task key
      };

      await request(app.getHttpServer())
        .post('/ai-agent/execute-flow')
        .send(invalidRequest)
        .expect(400);
    });

    it('should handle agent execution failures gracefully', async () => {
      mockExecuteAgentActionService.execute.mockResolvedValueOnce({
        ...mockAgentResult,
        result: AgentActionResult.ERROR,
        error: 'Agent execution failed',
      });

      const response = await request(app.getHttpServer())
        .post('/ai-agent/execute-flow')
        .send(validFlowRequest)
        .expect(200);

      expect(response.body.executionResult.status).toBe('failed');
      expect(response.body.message).toContain('errors');
    });
  });
});
