import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ExecuteFlowService } from './execute-flow.service';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';

@Controller('ai-agent/test-flow')
export class TestFlowController {
  private readonly logger = new Logger(TestFlowController.name);

  constructor(private readonly executeFlowService: ExecuteFlowService) {}

  @Post('converter-only')
  async testFlowConverterOnly(@Body() body: any) {
    this.logger.log('🧪 Testing FlowConverter without execution');

    // Импортируем FlowConverterService напрямую для тестирования
    const { FlowConverterService } = await import('./flow-converter.service');
    const converter = new FlowConverterService();

    // Создаем реалистичный Flow с Jira триггером
    const testFlow = {
      id: 'real-jira-flow-001',
      name: 'Real Jira Hair Analysis Flow',
      description: 'Реальный Flow для анализа стрижек с Jira интеграцией',
      version: '1.0',
      nodes: [
        {
          id: 'jira-trigger',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: {
            type: 'jira_move',
            name: 'Задача перемещена в "На проверку"',
            config: {
              boardType: 'jira',
              event: 'card_moved',
              targetColumn: 'На проверку',
              fromColumn: 'В работе',
            },
          },
        },
        {
          id: 'extract-photos',
          type: 'context',
          position: { x: 200, y: 0 },
          data: {
            type: 'extract_files',
            name: 'Получить фото клиента',
            config: {
              type: 'extract_files',
              filterByUser: 'client',
              fileTypes: ['jpg', 'png', 'heic'],
              variableName: 'client_photos',
            },
          },
        },
        {
          id: 'check-photos',
          type: 'logic',
          position: { x: 400, y: 0 },
          data: {
            type: 'if_else',
            name: 'Проверка наличия фото',
            config: {
              type: 'if_else',
              variable: 'client_photos',
              condition: 'not_empty',
              trueBranch: 'ai-analysis',
              falseBranch: 'request-photos',
            },
          },
        },
        {
          id: 'request-photos',
          type: 'action',
          position: { x: 600, y: -100 },
          data: {
            type: 'comment',
            name: 'Запросить фотографии',
            config: {
              type: 'comment',
              text: 'Пожалуйста, прикрепите фотографии "до" и "после" стрижки для анализа качества работы.',
            },
          },
        },
        {
          id: 'ai-analysis',
          type: 'action',
          position: { x: 600, y: 100 },
          data: {
            type: 'ai_request',
            name: 'AI анализ качества стрижки',
            config: {
              type: 'ai_request',
              aiModel: 'claude-3-sonnet',
              prompt: 'Ты профессиональный мастер-парикмахер с 15+ лет опыта. Проанализируй фотографии стрижки и дай детальную оценку:\n\n1. Техника выполнения (ровность линий, плавность переходов)\n2. Соответствие форме лица\n3. Качество укладки\n4. Общее впечатление\n\nДай оценку от 1 до 10 и конкретные рекомендации по улучшению.',
              attachments: ['client_photos'],
              responseVariable: 'hair_analysis',
              timeout: 120,
            },
          },
        },
        {
          id: 'publish-result',
          type: 'action',
          position: { x: 800, y: 100 },
          data: {
            type: 'comment',
            name: 'Опубликовать результат анализа',
            config: {
              type: 'comment',
              text: '✅ **Анализ качества стрижки завершен:**\n\n{{hair_analysis}}\n\n---\n*Анализ выполнен AI системой*',
            },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'jira-trigger', target: 'extract-photos' },
        { id: 'e2', source: 'extract-photos', target: 'check-photos' },
        { id: 'e3', source: 'check-photos', target: 'request-photos' },
        { id: 'e4', source: 'check-photos', target: 'ai-analysis' },
        { id: 'e5', source: 'ai-analysis', target: 'publish-result' },
      ],
      variables: [],
      settings: { maxRetries: 2, timeout: 300 },
    };

    const taskKey = body.taskKey || 'KAN-456';
    const triggerContext = {
      taskId: taskKey,
      userId: body.userId || 'stylist-ivan',
      columnName: 'На проверку',
      fromColumn: 'В работе',
      event: 'card_moved',
      timestamp: new Date().toISOString(),
    };

    try {
      // Тестируем только конвертацию, без выполнения
      const smartInstructions = await converter.convertFlowToInstructions(
        testFlow,
        taskKey,
        triggerContext,
      );

      const finalInstructionText = converter.generateFinalInstructionText(smartInstructions);

      this.logger.log(`✅ FlowConverter generated ${smartInstructions.length} smart instructions`);

      return {
        success: true,
        message: 'FlowConverter test completed successfully',
        flowId: testFlow.id,
        taskKey,
        conversion: {
          totalInstructions: smartInstructions.length,
          instructionsSummary: smartInstructions.map(inst => ({
            step: inst.instruction.substring(0, 50) + '...',
            priority: inst.priority,
            hasTimeout: !!inst.timeout,
            hasVariables: inst.variables.length > 0,
            hasDependencies: inst.dependencies.length > 0,
            hasRetries: !!inst.retries,
          })),
          finalInstructionPreview: finalInstructionText.substring(0, 500) + '...',
          fullInstructionLength: finalInstructionText.length,
        },
        flowAnalysis: {
          nodesCount: testFlow.nodes.length,
          edgesCount: testFlow.edges.length,
          triggerNodes: testFlow.nodes.filter(n => n.type === 'trigger').length,
          contextNodes: testFlow.nodes.filter(n => n.type === 'context').length,
          logicNodes: testFlow.nodes.filter(n => n.type === 'logic').length,
          actionNodes: testFlow.nodes.filter(n => n.type === 'action').length,
          aiNodes: testFlow.nodes.filter(n => n.data.type === 'ai_request').length,
        },
        rawInstructions: smartInstructions,
        fullInstructionText: finalInstructionText,
      };
    } catch (error) {
      this.logger.error('❌ FlowConverter test failed:', error);
      return {
        success: false,
        message: 'FlowConverter test failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }

  @Post('simple')
  async testSimpleFlow(@Body() body: any) {
    this.logger.log('🧪 Testing simple flow conversion');

    // Создаем тестовый Flow для демонстрации
    const testFlow: ExecuteFlowRequestDto = {
      flowDefinition: {
        id: 'demo-flow-001',
        name: 'Demo Hair Analysis Flow',
        description: 'Демонстрационный Flow для анализа стрижек',
        version: '1.0',
        nodes: [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 0, y: 0 },
            data: {
              type: 'jira_move',
              name: 'Карточка перемещена',
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
              name: 'Получить фото клиента',
              config: {
                type: 'extract_files',
                filterByUser: 'client',
                variableName: 'client_photos',
              },
            },
          },
          {
            id: 'action-1',
            type: 'action',
            position: { x: 400, y: 0 },
            data: {
              type: 'ai_request',
              name: 'Анализ качества стрижки',
              config: {
                type: 'ai_request',
                aiModel: 'claude-3-sonnet',
                prompt:
                  'Проанализируй качество стрижки на фотографиях. Оцени технику, симметрию, чистоту линий. Дай конструктивную обратную связь и рекомендации.',
                attachments: ['client_photos'],
                responseVariable: 'quality_analysis',
                timeout: 120,
              },
            },
          },
          {
            id: 'action-2',
            type: 'action',
            position: { x: 600, y: 0 },
            data: {
              type: 'comment',
              name: 'Опубликовать результат',
              config: {
                type: 'comment',
                text: 'Анализ завершен: {{quality_analysis}}',
              },
            },
          },
        ],
        edges: [
          { id: 'e1', source: 'trigger-1', target: 'context-1' },
          { id: 'e2', source: 'context-1', target: 'action-1' },
          { id: 'e3', source: 'action-1', target: 'action-2' },
        ],
        variables: [],
        settings: {},
      },
      taskKey: body.taskKey || 'HAIR-DEMO-123',
      triggerContext: {
        columnName: 'На проверку',
        triggerType: 'card_moved',
        taskData: {
          key: body.taskKey || 'HAIR-DEMO-123',
          userId: body.userId || 'demo-user-456',
          event: 'card_moved',
          fromColumn: 'В работе',
          toColumn: 'На проверку',
          timestamp: new Date().toISOString(),
        },
      },
    };

    try {
      // Выполняем Flow через наш умный сервис
      const result = await this.executeFlowService.execute(testFlow);

      this.logger.log('✅ Flow conversion completed successfully');

      return {
        success: true,
        message: 'Flow converted to intelligent AI instructions',
        flowId: testFlow.flowDefinition.id,
        taskKey: testFlow.taskKey,
        instructionsGenerated: result.executionResult?.steps?.length || 0,
        executionId: result.executionId,
        preview: {
          flowName: testFlow.flowDefinition.name,
          nodesCount: testFlow.flowDefinition.nodes.length,
          edgesCount: testFlow.flowDefinition.edges.length,
          executionStatus: result.executionResult?.status,
          stepsCompleted:
            result.executionResult?.steps?.filter(
              (s: any) => s.status === 'completed',
            ).length || 0,
          totalSteps: result.executionResult?.steps?.length || 0,
        },
        rawResult: result,
      };
    } catch (error) {
      this.logger.error('❌ Flow conversion failed:', error);

      return {
        success: false,
        message: 'Flow conversion failed',
        error: error.message,
        flowId: testFlow.flowDefinition.id,
      };
    }
  }

  @Post('complex')
  async testComplexFlow() {
    this.logger.log('🧪 Testing complex flow with conditions and loops');

    // Более сложный Flow с условиями и циклами
    const complexFlow: ExecuteFlowRequestDto = {
      flowDefinition: {
        id: 'complex-flow-001',
        name: 'Complex Quality Control Flow',
        description: 'Сложный Flow с условиями и циклами для контроля качества',
        version: '1.0',
        nodes: [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 0, y: 0 },
            data: {
              type: 'jira_move',
              name: 'Задача на проверку',
              config: {
                boardType: 'jira',
                event: 'card_moved',
                targetColumn: 'QA Review',
              },
            },
          },
          {
            id: 'context-1',
            type: 'context',
            position: { x: 200, y: 0 },
            data: {
              type: 'extract_files',
              name: 'Получить все файлы',
              config: {
                type: 'extract_files',
                filterByUser: 'all',
                variableName: 'all_files',
              },
            },
          },
          {
            id: 'logic-1',
            type: 'logic',
            position: { x: 400, y: 0 },
            data: {
              type: 'if_else',
              name: 'Проверка наличия файлов',
              config: {
                type: 'if_else',
                variable: 'all_files',
                condition: 'not_empty',
                trueBranch: 'ai-analysis',
                falseBranch: 'request-files',
              },
            },
          },
          {
            id: 'request-files',
            type: 'action',
            position: { x: 600, y: -100 },
            data: {
              type: 'comment',
              name: 'Запросить файлы',
              config: {
                type: 'comment',
                text: 'Пожалуйста, загрузите файлы работы для проверки качества',
              },
            },
          },
          {
            id: 'ai-analysis',
            type: 'action',
            position: { x: 600, y: 100 },
            data: {
              type: 'ai_request',
              name: 'AI анализ качества',
              config: {
                type: 'ai_request',
                aiModel: 'claude-3-opus',
                prompt:
                  'Проведи детальный анализ качества работы. Проверь техническое исполнение, соответствие требованиям, эстетические аспекты. Дай оценку от 1 до 10 и подробные рекомендации.',
                attachments: ['all_files'],
                responseVariable: 'quality_score',
                timeout: 180,
              },
            },
          },
          {
            id: 'logic-2',
            type: 'logic',
            position: { x: 800, y: 100 },
            data: {
              type: 'if_else',
              name: 'Проверка оценки',
              config: {
                type: 'if_else',
                variable: 'quality_score',
                condition: 'greater_than',
                value: '7',
                trueBranch: 'approve',
                falseBranch: 'reject',
              },
            },
          },
          {
            id: 'approve',
            type: 'action',
            position: { x: 1000, y: 50 },
            data: {
              type: 'comment',
              name: 'Утвердить работу',
              config: {
                type: 'comment',
                text: '✅ Работа утверждена! Оценка качества: {{quality_score}}',
              },
            },
          },
          {
            id: 'reject',
            type: 'action',
            position: { x: 1000, y: 150 },
            data: {
              type: 'comment',
              name: 'Отклонить работу',
              config: {
                type: 'comment',
                text: '❌ Работа требует доработки. Анализ: {{quality_score}}',
              },
            },
          },
        ],
        edges: [
          { id: 'e1', source: 'trigger-1', target: 'context-1' },
          { id: 'e2', source: 'context-1', target: 'logic-1' },
          { id: 'e3', source: 'logic-1', target: 'request-files' },
          { id: 'e4', source: 'logic-1', target: 'ai-analysis' },
          { id: 'e5', source: 'ai-analysis', target: 'logic-2' },
          { id: 'e6', source: 'logic-2', target: 'approve' },
          { id: 'e7', source: 'logic-2', target: 'reject' },
        ],
        variables: [],
        settings: { maxRetries: 3, timeout: 300 },
      },
      taskKey: 'QA-COMPLEX-789',
      triggerContext: {
        columnName: 'QA Review',
        triggerType: 'card_moved',
        taskData: {
          key: 'QA-COMPLEX-789',
          userId: 'qa-manager-123',
          event: 'card_moved',
          fromColumn: 'In Progress',
          toColumn: 'QA Review',
          timestamp: new Date().toISOString(),
        },
      },
    };

    try {
      const result = await this.executeFlowService.execute(complexFlow);

      this.logger.log('✅ Complex flow conversion completed successfully');

      return {
        success: true,
        message: 'Complex Flow converted to intelligent AI instructions',
        flowId: complexFlow.flowDefinition.id,
        complexity: {
          totalNodes: complexFlow.flowDefinition.nodes.length,
          logicNodes: complexFlow.flowDefinition.nodes.filter(
            (n) => n.type === 'logic',
          ).length,
          aiNodes: complexFlow.flowDefinition.nodes.filter(
            (n) => n.data.type === 'ai_request',
          ).length,
          branches: complexFlow.flowDefinition.edges.length,
        },
        intelligentFeatures: {
          conditionalLogic: true,
          variableTracking: true,
          errorHandling: true,
          timeoutManagement: true,
          dependencyResolution: true,
        },
        result,
      };
    } catch (error) {
      this.logger.error('❌ Complex flow conversion failed:', error);
      return {
        success: false,
        message: 'Complex flow conversion failed',
        error: error.message,
      };
    }
  }
}
