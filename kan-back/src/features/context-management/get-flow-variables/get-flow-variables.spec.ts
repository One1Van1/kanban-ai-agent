import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetFlowVariablesController } from './get-flow-variables.controller';
import { GetFlowVariablesService } from './get-flow-variables.service';
import { VariableType, VariableScope } from './get-flow-variables.query.dto';

describe('GetFlowVariablesController (E2E)', () => {
  let app: INestApplication;
  let getFlowVariablesService: GetFlowVariablesService;

  const mockVariables = [
    {
      name: 'user_email',
      value: 'john.doe@company.com',
      type: VariableType.STRING,
      scope: VariableScope.GLOBAL,
      description: 'Current user email address',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'step_1',
      isSystem: false,
      isReadOnly: false,
      tags: ['user', 'email'],
    },
    {
      name: 'task_count',
      value: 42,
      type: VariableType.NUMBER,
      scope: VariableScope.LOCAL,
      description: 'Number of tasks processed',
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T12:15:00Z',
      createdBy: 'step_3',
      isSystem: false,
      isReadOnly: false,
      tags: ['counter', 'tasks'],
    },
    {
      name: 'is_processing',
      value: true,
      type: VariableType.BOOLEAN,
      scope: VariableScope.SHARED,
      description: 'Whether flow is currently processing',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T12:45:00Z',
      createdBy: 'system',
      isSystem: true,
      isReadOnly: true,
      tags: ['status', 'system'],
    },
  ];

  const mockSummary = {
    totalVariables: 3,
    typeCount: {
      string: 1,
      number: 1,
      boolean: 1,
      object: 0,
      array: 0,
    },
    scopeCount: {
      global: 1,
      local: 1,
      shared: 1,
      temporary: 0,
    },
    variablesWithValues: 3,
    systemVariables: 1,
  };

  const mockResponse = {
    success: true,
    message: 'Flow variables retrieved successfully',
    variables: mockVariables,
    summary: mockSummary,
    flowExecutionId: 'flow_exec_123',
    flowId: 'marketing_automation_v1',
  };

  const mockGetFlowVariablesService = {
    execute: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetFlowVariablesController],
      providers: [
        {
          provide: GetFlowVariablesService,
          useValue: mockGetFlowVariablesService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getFlowVariablesService = moduleFixture.get<GetFlowVariablesService>(
      GetFlowVariablesService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /context/flow/:flowId/variables', () => {
    const flowId = 'flow_exec_123';

    it('should successfully retrieve flow variables', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('variables');
      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('flowExecutionId', flowId);
      expect(response.body).toHaveProperty('flowId');

      // Проверяем структуру переменных
      const variables = response.body.variables;
      expect(Array.isArray(variables)).toBe(true);
      expect(variables).toHaveLength(3);

      // Проверяем структуру первой переменной
      const firstVariable = variables[0];
      expect(firstVariable).toHaveProperty('name');
      expect(firstVariable).toHaveProperty('value');
      expect(firstVariable).toHaveProperty('type');
      expect(firstVariable).toHaveProperty('scope');
      expect(firstVariable).toHaveProperty('createdAt');
      expect(firstVariable).toHaveProperty('isSystem');
      expect(firstVariable).toHaveProperty('isReadOnly');

      // Проверяем структуру сводки
      const summary = response.body.summary;
      expect(summary).toHaveProperty('totalVariables');
      expect(summary).toHaveProperty('typeCount');
      expect(summary).toHaveProperty('scopeCount');
      expect(summary).toHaveProperty('variablesWithValues');
      expect(summary).toHaveProperty('systemVariables');

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.any(Object),
      );
    });

    it('should handle variable type filtering', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          type: VariableType.STRING,
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          type: VariableType.STRING,
        }),
      );
    });

    it('should handle variable scope filtering', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          scope: VariableScope.GLOBAL,
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          scope: VariableScope.GLOBAL,
        }),
      );
    });

    it('should handle search parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          search: 'user',
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          search: 'user',
        }),
      );
    });

    it('should handle hasValue filter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          hasValue: true,
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          hasValue: true,
        }),
      );
    });

    it('should handle includeSystem filter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          includeSystem: false,
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          includeSystem: false,
        }),
      );
    });

    it('should return correct variable types', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .expect(200);

      const variables = response.body.variables;
      const types = variables.map((v: any) => v.type);

      expect(types).toContain(VariableType.STRING);
      expect(types).toContain(VariableType.NUMBER);
      expect(types).toContain(VariableType.BOOLEAN);
    });

    it('should return correct variable scopes', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .expect(200);

      const variables = response.body.variables;
      const scopes = variables.map((v: any) => v.scope);

      expect(scopes).toContain(VariableScope.GLOBAL);
      expect(scopes).toContain(VariableScope.LOCAL);
      expect(scopes).toContain(VariableScope.SHARED);
    });

    it('should return summary with correct counts', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .expect(200);

      const summary = response.body.summary;

      expect(summary.totalVariables).toBe(3);
      expect(summary.typeCount.string).toBe(1);
      expect(summary.typeCount.number).toBe(1);
      expect(summary.typeCount.boolean).toBe(1);
      expect(summary.scopeCount.global).toBe(1);
      expect(summary.variablesWithValues).toBe(3);
      expect(summary.systemVariables).toBe(1);
    });

    it('should handle service errors gracefully', async () => {
      mockGetFlowVariablesService.execute.mockRejectedValueOnce(
        new Error('Flow not found'),
      );

      await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .expect(500);
    });

    it('should validate enum parameters correctly', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          type: 'invalid_type', // Невалидный тип
        })
        .expect(400);
    });

    it('should handle multiple filters combined', async () => {
      const response = await request(app.getHttpServer())
        .get(`/context/flow/${flowId}/variables`)
        .query({
          type: VariableType.STRING,
          scope: VariableScope.GLOBAL,
          hasValue: true,
          includeSystem: false,
          search: 'email',
        })
        .expect(200);

      expect(mockGetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          type: VariableType.STRING,
          scope: VariableScope.GLOBAL,
          hasValue: true,
          includeSystem: false,
          search: 'email',
        }),
      );
    });
  });
});
