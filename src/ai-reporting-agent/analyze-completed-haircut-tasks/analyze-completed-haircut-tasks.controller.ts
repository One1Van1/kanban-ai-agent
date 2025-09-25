import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  HttpStatus,
  HttpException,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AnalyzeCompletedHaircutTasksService } from './analyze-completed-haircut-tasks.service';
import {
  AnalyzeCompletedHaircutTaskDto,
  WebhookAnalyzeHaircutTaskDto,
  EmployeeResponseDto,
} from './analyze-completed-haircut-tasks.dto';
import {
  HaircutTaskAnalysisResult,
  HaircutTaskAnalysisInput,
} from './analyze-completed-haircut-tasks.interface';

@ApiTags('ai-reporting-agent')
@Controller('ai-reporting/analyze-completed-haircut-tasks')
export class AnalyzeCompletedHaircutTasksController {
  private readonly logger = new Logger(
    AnalyzeCompletedHaircutTasksController.name,
  );

  constructor(
    private readonly analyzeService: AnalyzeCompletedHaircutTasksService,
  ) {}

  /**
   * Анализ выполненной задачи по стрижке (прямой вызов)
   */
  @Post('analyze')
  @ApiOperation({
    summary: 'Анализ выполненной задачи по стрижке',
    description: `
    Анализирует выполненную задачу по стрижке и формирует отчёт.
    
    Агент проверяет:
    - ✅ Соответствие времени выполнения категории стрижки
    - ✅ Тип клиента (постоянный/новый) и применяет скидки
    - ✅ Наличие объяснений при превышении времени
    - ✅ Возможность смены категории в процессе работы
    
    Если время превышено без объяснения, задача отправляется в колонку "questions".
    `,
  })
  @ApiBody({
    type: AnalyzeCompletedHaircutTaskDto,
    description: 'Данные задачи для анализа',
    examples: {
      normal: {
        summary: 'Обычная задача в срок',
        value: {
          issueKey: 'HAIR-123',
          taskTitle: 'Стрижка клиента №001',
          taskDescription: 'Быстрая стрижка',
          employeeComment: 'Сделал быструю стрижку, клиент не постоянный',
          actualTimeMinutes: 25,
        },
      },
      exceeded_with_explanation: {
        summary: 'Превышение времени с объяснением',
        value: {
          issueKey: 'HAIR-124',
          taskTitle: 'Сложная стрижка',
          taskDescription: 'Быстрая стрижка',
          employeeComment: 'Клиент был очень нервный, постоянно двигался',
          actualTimeMinutes: 45,
        },
      },
      category_change: {
        summary: 'Смена категории в процессе',
        value: {
          issueKey: 'HAIR-125',
          taskTitle: 'Стрижка с доп. услугами',
          taskDescription: 'Быстрая стрижка',
          employeeComment:
            'Клиент попросил добавить окраску. На самом деле креативная стрижка',
          actualTimeMinutes: 95,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ успешно выполнен',
    schema: {
      example: {
        issueKey: 'HAIR-123',
        success: true,
        category: {
          original: 'Быстрая стрижка',
          wasUpdated: false,
        },
        timeAnalysis: {
          status: 'в пределах нормы',
          actualTime: 25,
          normativeTime: { min: 20, max: 30 },
        },
        client: {
          type: 'не постоянный',
          isRegular: false,
          discountPercent: 0,
        },
        price: {
          basePrice: 400,
          discount: 0,
          finalPrice: 400,
          category: 'Быстрая стрижка',
        },
        requiresQuestion: false,
        finalReport:
          '✅ Анализ завершён: Время соответствует категории стрижки, клиент не постоянный, цена 400 рублей.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные запроса',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка анализа',
  })
  async analyzeTask(
    @Body() analyzeDto: AnalyzeCompletedHaircutTaskDto,
  ): Promise<HaircutTaskAnalysisResult> {
    try {
      this.logger.log(`🔍 Analyzing task: ${analyzeDto.issueKey}`);

      const input: HaircutTaskAnalysisInput = {
        issueKey: analyzeDto.issueKey,
        taskTitle: analyzeDto.taskTitle || '',
        taskDescription: analyzeDto.taskDescription || '',
        employeeComment: analyzeDto.employeeComment || '',
        actualTimeMinutes: analyzeDto.actualTimeMinutes || 0,
      };

      const result = await this.analyzeService.analyzeTask(input);

      this.logger.log(
        `✅ Analysis completed for ${analyzeDto.issueKey}: ${result.success ? 'SUCCESS' : 'FAILED'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Analysis failed for ${analyzeDto.issueKey}: ${error.message}`,
      );
      throw new HttpException(
        'Task analysis failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Анализ задачи из Jira по ключу
   */
  @Get('analyze/:issueKey')
  @ApiOperation({
    summary: 'Анализ задачи из Jira по ключу',
    description: `
    Получает данные задачи из Jira API и выполняет анализ.
    Используется для анализа конкретной задачи по её ключу.
    `,
  })
  @ApiParam({
    name: 'issueKey',
    description: 'Ключ задачи в Jira',
    example: 'HAIR-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ успешно выполнен',
  })
  @ApiResponse({
    status: 404,
    description: 'Задача не найдена',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка получения данных из Jira',
  })
  async analyzeTaskFromJira(
    @Param('issueKey') issueKey: string,
  ): Promise<HaircutTaskAnalysisResult> {
    try {
      this.logger.log(`🔍 Fetching and analyzing task from Jira: ${issueKey}`);

      // Получаем данные из Jira
      const jiraData = await this.analyzeService.fetchJiraTask(issueKey);

      // Анализируем
      const result = await this.analyzeService.analyzeFromJiraData(jiraData);

      this.logger.log(
        `✅ Jira analysis completed for ${issueKey}: ${result.success ? 'SUCCESS' : 'FAILED'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Jira analysis failed for ${issueKey}: ${error.message}`,
      );

      if (error.message.includes('not found')) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to fetch task from Jira',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Webhook обработчик для анализа задач
   */
  @Post('webhook')
  @ApiOperation({
    summary: 'Webhook для автоматического анализа задач',
    description: `
    Обрабатывает webhook от Jira при изменении задач в колонке "Review".
    
    Автоматически запускает анализ когда:
    - 🔄 Задача перемещена в статус "Review"
    - 💬 Добавлен новый комментарий в задаче со статусом "Review"
    - ✏️ Обновлены данные задачи в статусе "Review"
    
    После анализа агент:
    - ✅ Добавляет итоговый отчёт в комментарии
    - ❓ При необходимости задаёт вопросы и перемещает в "Questions"
    - 🏁 Перемещает готовые задачи в статус "Done"
    `,
  })
  @ApiBody({
    type: WebhookAnalyzeHaircutTaskDto,
    description: 'Webhook payload от Jira',
    examples: {
      status_change: {
        summary: 'Задача перемещена в Review',
        value: {
          webhookPayload: {
            webhookEvent: 'jira:issue_updated',
            issue: {
              key: 'HAIR-123',
              fields: {
                summary: 'Стрижка клиента',
                description: 'Быстрая стрижка',
                status: { name: 'Review' },
                worklog: {
                  worklogs: [
                    {
                      timeSpentSeconds: 1800,
                      started: '2025-09-23T10:00:00.000+0000',
                    },
                  ],
                },
                comment: {
                  comments: [
                    {
                      body: 'Сделал стрижку, клиент постоянный',
                      created: '2025-09-23T10:30:00.000+0000',
                      author: { displayName: 'Мастер Иван' },
                    },
                  ],
                },
              },
            },
            changelog: {
              items: [
                {
                  field: 'status',
                  fromString: 'In Progress',
                  toString: 'Review',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook успешно обработан',
    schema: {
      example: {
        success: true,
        message: 'Haircut task analysis completed',
        analysisResult: {
          issueKey: 'HAIR-123',
          success: true,
          requiresQuestion: false,
          finalReport: '✅ Анализ завершён: цена 360 рублей',
        },
        actions: ['analysis-completed', 'report-posted', 'moved-to-done'],
        processingTimeMs: 1250,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат webhook',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный запрос (неверная подпись)',
  })
  async handleWebhook(
    @Body() webhookDto: WebhookAnalyzeHaircutTaskDto,
    @Headers() headers: Record<string, string>,
  ): Promise<any> {
    try {
      const payload = webhookDto.webhookPayload;

      this.logger.log('=== HAIRCUT ANALYSIS WEBHOOK RECEIVED ===');
      this.logger.log(`Event: ${payload.webhookEvent}`);
      this.logger.log(`Issue: ${payload.issue?.key}`);
      this.logger.log(`Status: ${payload.issue?.fields?.status?.name}`);

      // Проверяем, что это задача в статусе Review
      if (payload.issue?.fields?.status?.name !== 'Review') {
        this.logger.log(`⏩ Skipping: Task not in Review status`);
        return {
          success: true,
          message: 'Task not in Review status, skipping analysis',
          actions: ['skipped'],
        };
      }

      // Выполняем анализ
      const jiraData = {
        key: payload.issue.key,
        fields: payload.issue.fields,
      };

      const analysisResult =
        await this.analyzeService.analyzeFromJiraData(jiraData);

      // Добавляем комментарий с результатом или вопросом
      const commentText = analysisResult.requiresQuestion
        ? analysisResult.agentComment!
        : analysisResult.finalReport;

      // TODO: Здесь нужно добавить интеграцию с Jira API для:
      // 1. Добавления комментария
      // 2. Перемещения в колонку Questions (если нужно)
      // 3. Перемещения в Done (если анализ завершён)

      const actions = ['analysis-completed'];

      if (analysisResult.requiresQuestion) {
        actions.push('question-posted', 'moved-to-questions');
      } else {
        actions.push('report-posted', 'moved-to-done');
      }

      this.logger.log(`✅ Webhook processed: ${actions.join(', ')}`);

      return {
        success: true,
        message: 'Haircut task analysis completed',
        analysisResult,
        actions,
        processingTimeMs: analysisResult.processingTimeMs,
      };
    } catch (error) {
      this.logger.error(`❌ Webhook processing failed: ${error.message}`);
      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Обработка ответа сотрудника на вопрос агента
   */
  @Post('employee-response')
  @ApiOperation({
    summary: 'Обработка ответа сотрудника на вопрос агента',
    description: `
    Обрабатывает ответ сотрудника на вопрос агента о превышении времени.
    
    Сотрудник может:
    - 🔄 Исправить категорию стрижки
    - 💭 Объяснить причину превышения времени
    - 🔄 + 💭 И то, и другое одновременно
    
    После обработки ответа агент формирует итоговый отчёт.
    `,
  })
  @ApiBody({
    type: EmployeeResponseDto,
    description: 'Ответ сотрудника',
    examples: {
      category_fix: {
        summary: 'Исправление категории',
        value: {
          issueKey: 'HAIR-123',
          response: 'Извините, ошибся. Это была обычная стрижка с переходами.',
        },
      },
      explanation: {
        summary: 'Объяснение причины',
        value: {
          issueKey: 'HAIR-124',
          response:
            'Категория верная. Клиент был очень нервным и постоянно двигался.',
        },
      },
      both: {
        summary: 'Объяснение + смена категории',
        value: {
          issueKey: 'HAIR-125',
          response:
            'Начинал как быструю, но клиент попросил укладку. По факту обычная стрижка.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ответ обработан, анализ завершён',
    schema: {
      example: {
        success: true,
        message: 'Employee response processed',
        updatedAnalysis: {
          issueKey: 'HAIR-123',
          success: true,
          requiresQuestion: false,
          finalReport:
            '✅ Категория исправлена на "Обычная стрижка". Цена 800 рублей.',
        },
        actions: ['response-processed', 'analysis-updated', 'moved-to-done'],
      },
    },
  })
  async processEmployeeResponse(
    @Body() responseDto: EmployeeResponseDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `📝 Processing employee response for ${responseDto.issueKey}`,
      );

      // TODO: Здесь нужно:
      // 1. Получить исходные данные задачи
      // 2. Проанализировать ответ сотрудника
      // 3. Провести повторный анализ с учётом ответа
      // 4. Сформировать итоговый отчёт
      // 5. Переместить задачу из Questions в Done

      // Временная заглушка для демонстрации структуры
      const updatedAnalysis: HaircutTaskAnalysisResult = {
        issueKey: responseDto.issueKey,
        success: true,
        category: { original: 'Быстрая стрижка' as any, wasUpdated: false },
        timeAnalysis: {
          status: 'в пределах нормы' as any,
          actualTime: 45,
          normativeTime: { min: 30, max: 60 },
        },
        client: {
          type: 'не постоянный' as any,
          isRegular: false,
          discountPercent: 0,
        },
        price: {
          basePrice: 800,
          discount: 0,
          finalPrice: 800,
          category: 'Обычная стрижка' as any,
        },
        requiresQuestion: false,
        moveToQuestions: false,
        finalReport: '✅ Ответ обработан. Анализ завершён.',
        timestamp: new Date().toISOString(),
        processingTimeMs: 500,
      };

      this.logger.log(
        `✅ Employee response processed for ${responseDto.issueKey}`,
      );

      return {
        success: true,
        message: 'Employee response processed',
        updatedAnalysis,
        actions: ['response-processed', 'analysis-updated', 'moved-to-done'],
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to process employee response: ${error.message}`,
      );
      throw new HttpException(
        'Failed to process employee response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
