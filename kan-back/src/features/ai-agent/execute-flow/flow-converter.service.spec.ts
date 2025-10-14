import { Test, TestingModule } from '@nestjs/testing';
import { FlowConverterService } from './flow-converter.service';
import { FlowDefinition, FlowNode } from './execute-flow.request.dto';

describe('FlowConverterService', () => {
  let service: FlowConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowConverterService],
    }).compile();

    service = module.get<FlowConverterService>(FlowConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert simple flow to intelligent instructions', async () => {
    // Arrange - создаем тестовый Flow
    const testFlow: FlowDefinition = {
      id: 'test-flow-001',
      name: 'Test Hair Analysis Flow',
      description: 'Test flow for hair analysis',
      version: '1.0',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: {
            type: 'jira_move',
            name: 'Card moved trigger',
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
          position: { x: 200, y: 0 },
          data: {
            type: 'extract_files',
            name: 'Extract client files',
            config: {
              type: 'extract_files',
              filterByUser: 'client',
              variableName: 'client_photos',
            },
          },
        },
        {
          id: 'logic-1',
          type: 'logic',
          position: { x: 400, y: 0 },
          data: {
            type: 'if_else',
            name: 'Check if photos exist',
            config: {
              type: 'if_else',
              variable: 'client_photos',
              condition: 'empty',
              trueBranch: 'action-1',
              falseBranch: 'action-2',
            },
          },
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 600, y: -100 },
          data: {
            type: 'comment',
            name: 'Request photos',
            config: {
              type: 'comment',
              text: 'Пожалуйста, загрузите фотографии стрижки для анализа',
            },
          },
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 600, y: 100 },
          data: {
            type: 'ai_request',
            name: 'Analyze photos',
            config: {
              type: 'ai_request',
              aiModel: 'claude-3-sonnet',
              prompt: 'Проанализируй качество стрижки на фотографиях',
              attachments: ['client_photos'],
              responseVariable: 'analysis_result',
              timeout: 120,
            },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'trigger-1', target: 'context-1' },
        { id: 'e2', source: 'context-1', target: 'logic-1' },
        { id: 'e3', source: 'logic-1', target: 'action-1' },
        { id: 'e4', source: 'logic-1', target: 'action-2' },
      ],
      variables: [],
      settings: {},
    };

    const taskKey = 'HAIR-123';
    const initialContext = {
      taskId: 'HAIR-123',
      userId: 'user-456',
    };

    // Act - конвертируем Flow в инструкции
    const instructions = await service.convertFlowToInstructions(
      testFlow,
      taskKey,
      initialContext,
    );

    // Assert - проверяем результат
    expect(instructions).toBeDefined();
    expect(instructions.length).toBeGreaterThan(0);

    // Проверяем, что есть инструкции для всех типов узлов
    const triggerInstruction = instructions.find((i) =>
      i.instruction.includes('Триггер активирован'),
    );
    expect(triggerInstruction).toBeDefined();

    const contextInstruction = instructions.find((i) =>
      i.instruction.includes('Получи все файлы'),
    );
    expect(contextInstruction).toBeDefined();

    const logicInstruction = instructions.find((i) =>
      i.instruction.includes('Проверь переменную'),
    );
    expect(logicInstruction).toBeDefined();

    const actionInstructions = instructions.filter(
      (i) =>
        i.instruction.includes('ШАГ') &&
        (i.instruction.includes('комментарий') ||
          i.instruction.includes('AI модели')),
    );
    expect(actionInstructions.length).toBeGreaterThan(0);

    // Проверяем финальную инструкцию
    const finalInstruction = instructions.find((i) =>
      i.instruction.includes('ФИНАЛЬНЫЙ ШАГ'),
    );
    expect(finalInstruction).toBeDefined();
  });

  it('should generate comprehensive final instruction text', async () => {
    // Arrange - создаем простые тестовые инструкции
    const testInstructions = [
      {
        instruction: 'ШАГ 1: Триггер активирован',
        priority: 0,
        dependencies: [],
        variables: [],
      },
      {
        instruction: 'ШАГ 2: Получи файлы и сохрани в переменную photos',
        priority: 1,
        dependencies: [],
        variables: ['photos'],
        timeout: 30,
      },
      {
        instruction: 'ШАГ 3: Если photos пустая, добавь комментарий',
        priority: 2,
        dependencies: ['photos'],
        variables: ['photos'],
        errorHandling: 'При ошибке логируй и продолжай',
      },
    ];

    // Act - генерируем финальный текст
    const finalText = service.generateFinalInstructionText(testInstructions);

    // Assert - проверяем содержимое
    expect(finalText).toBeDefined();
    expect(finalText).toContain('ИНТЕЛЛЕКТУАЛЬНЫЕ AI ИНСТРУКЦИИ');
    expect(finalText).toContain('ВАЖНЫЕ ПРИНЦИПЫ');
    expect(finalText).toContain('ШАГ 1: Триггер активирован');
    expect(finalText).toContain('ШАГ 2: Получи файлы');
    expect(finalText).toContain('ШАГ 3: Если photos');
    expect(finalText).toContain('ТРЕБУЮТСЯ ПЕРЕМЕННЫЕ: photos');
    expect(finalText).toContain(
      'ОБРАБОТКА ОШИБОК: При ошибке логируй и продолжай',
    );
    expect(finalText).toContain('ТАЙМАУТ: 30 секунд');
    expect(finalText).toContain('ФИНАЛЬНЫЕ ТРЕБОВАНИЯ');
  });

  it('should handle complex AI action instructions', async () => {
    // Arrange
    const aiActionNode: FlowNode = {
      id: 'ai-action-1',
      type: 'action',
      position: { x: 0, y: 0 },
      data: {
        type: 'ai_request',
        name: 'Complex AI Analysis',
        config: {
          type: 'ai_request',
          aiModel: 'claude-3-opus',
          prompt:
            'Выполни детальный анализ качества стрижки и дай рекомендации по улучшению',
          attachments: ['client_photos', 'reference_photos'],
          responseVariable: 'detailed_analysis',
          timeout: 180,
        },
      },
    };

    // Act
    const context = {
      variables: new Map([
        ['client_photos', []],
        ['reference_photos', []],
      ]),
      conditions: [],
      loops: [],
      errorHandling: [],
      asyncOperations: [],
    };

    const instruction = await (service as any).convertNodeToSmartInstruction(
      aiActionNode,
      context,
      'HAIR-456',
      5,
    );

    // Assert
    expect(instruction).toBeDefined();
    expect(instruction.instruction).toContain('ШАГ 6');
    expect(instruction.instruction).toContain('claude-3-opus');
    expect(instruction.instruction).toContain(
      'детальный анализ качества стрижки',
    );
    expect(instruction.instruction).toContain(
      'client_photos, reference_photos',
    );
    expect(instruction.instruction).toContain('detailed_analysis');
    expect(instruction.timeout).toBe(180);
    expect(instruction.retries).toBe(2);
    expect(instruction.variables).toContain('client_photos');
    expect(instruction.variables).toContain('reference_photos');
    expect(instruction.variables).toContain('detailed_analysis');
    expect(instruction.errorHandling).toContain(
      'попробуй еще раз через 10 секунд',
    );
  });

  it('should analyze flow connections correctly', async () => {
    // Arrange - создаем Flow с связями
    const nodes: FlowNode[] = [
      {
        id: 'start',
        type: 'trigger',
        position: { x: 0, y: 0 },
        data: { type: 'trigger', name: 'Start', config: {} },
      },
      {
        id: 'middle',
        type: 'context',
        position: { x: 200, y: 0 },
        data: { type: 'context', name: 'Middle', config: {} },
      },
      {
        id: 'end',
        type: 'action',
        position: { x: 400, y: 0 },
        data: { type: 'action', name: 'End', config: {} },
      },
    ];

    const edges = [
      { id: 'e1', source: 'start', target: 'middle' },
      { id: 'e2', source: 'middle', target: 'end' },
    ];

    // Act - анализируем порядок
    const order = (service as any).analyzeFlowConnections(nodes, edges);

    // Assert - проверяем правильный порядок
    expect(order).toEqual(['start', 'middle', 'end']);
  });
});
