import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SetFlowVariablesController } from './set-flow-variables.controller';
import { SetFlowVariablesService } from './set-flow-variables.service';
import {
  VariableType,
  VariableScope,
  UpdateMode,
} from './set-flow-variables.request.dto';

describe('SetFlowVariablesController (E2E)', () => {
  let app: INestApplication;
  let setFlowVariablesService: SetFlowVariablesService;

  const mockResults = [
    {
      name: 'user_email',
      success: true,
      action: 'created',
      message: 'Variable created successfully',
      setValue: 'john.doe@company.com',
      previousValue: null,
    },
    {
      name: 'task_count',
      success: true,
      action: 'updated',
      message: 'Variable updated successfully',
      setValue: 50,
      previousValue: 42,
    },
  ];

  const mockSummary = {
    totalProcessed: 2,
    created: 1,
    updated: 1,
    skipped: 0,
    failed: 0,
    processingTime: '00:00:00.123',
  };

  const mockResponse = {
    success: true,
    message: 'Flow variables set successfully',
    results: mockResults,
    summary: mockSummary,
    flowExecutionId: 'flow_exec_123',
    flowId: 'marketing_automation_v1',
    timestamp: '2024-01-15T12:45:30Z',
  };

  const mockSetFlowVariablesService = {
    execute: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SetFlowVariablesController],
      providers: [
        {
          provide: SetFlowVariablesService,
          useValue: mockSetFlowVariablesService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    setFlowVariablesService = moduleFixture.get<SetFlowVariablesService>(
      SetFlowVariablesService,
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /context/flow/:flowId/variables', () => {
    const flowId = 'flow_exec_123';

    const validRequestBody = {
      variables: [
        {
          name: 'user_email',
          value: 'john.doe@company.com',
          type: VariableType.STRING,
          scope: VariableScope.GLOBAL,
          description: 'Current user email address',
          tags: ['user', 'email'],
        },
        {
          name: 'task_count',
          value: 50,
          type: VariableType.NUMBER,
          scope: VariableScope.LOCAL,
          description: 'Number of processed tasks',
        },
      ],
      updateMode: UpdateMode.REPLACE,
      createdBy: 'step_3',
      validateTypes: true,
    };

    it('should successfully set flow variables', async () => {
      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(validRequestBody)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('flowExecutionId', flowId);
      expect(response.body).toHaveProperty('flowId');
      expect(response.body).toHaveProperty('timestamp');

      // Проверяем структуру результатов
      const results = response.body.results;
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);

      // Проверяем структуру первого результата
      const firstResult = results[0];
      expect(firstResult).toHaveProperty('name');
      expect(firstResult).toHaveProperty('success');
      expect(firstResult).toHaveProperty('action');
      expect(firstResult).toHaveProperty('message');
      expect(firstResult).toHaveProperty('setValue');

      // Проверяем структуру сводки
      const summary = response.body.summary;
      expect(summary).toHaveProperty('totalProcessed');
      expect(summary).toHaveProperty('created');
      expect(summary).toHaveProperty('updated');
      expect(summary).toHaveProperty('skipped');
      expect(summary).toHaveProperty('failed');
      expect(summary).toHaveProperty('processingTime');

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        validRequestBody,
      );
    });

    it('should handle single variable creation', async () => {
      const singleVariableRequest = {
        variables: [
          {
            name: 'new_variable',
            value: 'test_value',
            type: VariableType.STRING,
            scope: VariableScope.LOCAL,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(singleVariableRequest)
        .expect(201);

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        singleVariableRequest,
      );
    });

    it('should handle different variable types', async () => {
      const multiTypeRequest = {
        variables: [
          {
            name: 'string_var',
            value: 'text',
            type: VariableType.STRING,
            scope: VariableScope.GLOBAL,
          },
          {
            name: 'number_var',
            value: 42,
            type: VariableType.NUMBER,
            scope: VariableScope.LOCAL,
          },
          {
            name: 'boolean_var',
            value: true,
            type: VariableType.BOOLEAN,
            scope: VariableScope.SHARED,
          },
          {
            name: 'object_var',
            value: { key: 'value' },
            type: VariableType.OBJECT,
            scope: VariableScope.LOCAL,
          },
          {
            name: 'array_var',
            value: [1, 2, 3],
            type: VariableType.ARRAY,
            scope: VariableScope.GLOBAL,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(multiTypeRequest)
        .expect(201);

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        multiTypeRequest,
      );
    });

    it('should handle different update modes', async () => {
      const mergeRequest = {
        variables: [
          {
            name: 'config_object',
            value: { newKey: 'newValue' },
            type: VariableType.OBJECT,
            scope: VariableScope.GLOBAL,
          },
        ],
        updateMode: UpdateMode.MERGE,
      };

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(mergeRequest)
        .expect(201);

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          updateMode: UpdateMode.MERGE,
        }),
      );
    });

    it('should handle read-only override option', async () => {
      const readOnlyRequest = {
        variables: [
          {
            name: 'readonly_var',
            value: 'new_value',
            type: VariableType.STRING,
            scope: VariableScope.GLOBAL,
          },
        ],
        overwriteReadOnly: true,
      };

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(readOnlyRequest)
        .expect(201);

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          overwriteReadOnly: true,
        }),
      );
    });

    it('should handle type validation option', async () => {
      const validationRequest = {
        variables: [
          {
            name: 'validated_var',
            value: 123,
            type: VariableType.NUMBER,
            scope: VariableScope.LOCAL,
          },
        ],
        validateTypes: true,
      };

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(validationRequest)
        .expect(201);

      expect(mockSetFlowVariablesService.execute).toHaveBeenCalledWith(
        flowId,
        expect.objectContaining({
          validateTypes: true,
        }),
      );
    });

    it('should return correct summary statistics', async () => {
      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(validRequestBody)
        .expect(201);

      const summary = response.body.summary;
      expect(summary.totalProcessed).toBe(2);
      expect(summary.created).toBe(1);
      expect(summary.updated).toBe(1);
      expect(summary.skipped).toBe(0);
      expect(summary.failed).toBe(0);
      expect(typeof summary.processingTime).toBe('string');
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        variables: [], // Empty array should be invalid
      };

      await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(invalidRequest)
        .expect(400);
    });

    it('should validate variable structure', async () => {
      const invalidVariableRequest = {
        variables: [
          {
            // Missing required fields
            name: 'invalid_var',
            // Missing value, type, scope
          },
        ],
      };

      await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(invalidVariableRequest)
        .expect(400);
    });

    it('should validate enum values', async () => {
      const invalidEnumRequest = {
        variables: [
          {
            name: 'test_var',
            value: 'test',
            type: 'invalid_type', // Invalid enum value
            scope: VariableScope.GLOBAL,
          },
        ],
      };

      await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(invalidEnumRequest)
        .expect(400);
    });

    it('should handle service errors gracefully', async () => {
      mockSetFlowVariablesService.execute.mockRejectedValueOnce(
        new Error('Flow not found'),
      );

      await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(validRequestBody)
        .expect(500);
    });

    it('should handle partial failures correctly', async () => {
      const partialFailureResponse = {
        ...mockResponse,
        success: false,
        message: '1 variables failed to set',
        summary: {
          ...mockSummary,
          failed: 1,
          totalProcessed: 3,
        },
      };

      mockSetFlowVariablesService.execute.mockResolvedValueOnce(
        partialFailureResponse,
      );

      const response = await request(app.getHttpServer())
        .post(`/context/flow/${flowId}/variables`)
        .send(validRequestBody)
        .expect(201);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('failed to set');
      expect(response.body.summary.failed).toBe(1);
    });
  });
});
