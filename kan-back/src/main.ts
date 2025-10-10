import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 КРИТИЧНО: body-parser должен быть ПЕРВЫМ для парсинга webhook данных
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Обрабатываем webhook на корневом пути (исправляем неправильную настройку Jira)
  app.use('/', async (req: any, res: any, next: any) => {
    if (req.method === 'POST' && req.url.includes('triggeredByUser')) {
      console.log(`🌐 WEBHOOK RECEIVED ON ROOT PATH: ${req.method} ${req.url}`);
      console.log(
        `📦 Body size:`,
        JSON.stringify(req.body).length,
        'characters',
      );

      console.log(`🔄 FORWARDING TO CORRECT ENDPOINT`);

      try {
        // Добавим логирование данных для диагностики
        console.log(`📋 Webhook event:`, req.body.webhookEvent);
        console.log(`🎯 Task key:`, req.body.issue?.key);
        console.log(`📊 Status:`, req.body.issue?.fields?.status?.name);
        console.log(
          `👤 Assignee:`,
          req.body.issue?.fields?.assignee?.displayName,
          '|',
          req.body.issue?.fields?.assignee?.accountId,
        );

        // 🚀 УНИВЕРСАЛЬНЫЙ РОУТИНГ - направляем ВСЕ webhook'и на общий обработчик
        // Он сам найдёт нужных агентов для конкретной колонки
        const targetEndpoint = '/jira/webhook';
        console.log(
          `🎯 Routing to UNIVERSAL webhook handler: ${targetEndpoint}`,
        );

        // Делаем внутренний HTTP запрос к правильному endpoint
        const response = await axios.default.post(
          `http://localhost:3000${targetEndpoint}`,
          req.body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 секунд таймаут
          },
        );

        console.log(`✅ WEBHOOK FORWARDED SUCCESSFULLY`);

        // Возвращаем результат от правильного endpoint
        return res.status(response.status).json(response.data);
      } catch (error) {
        console.error(`❌ ERROR FORWARDING WEBHOOK:`, error.message);
        if (error.response) {
          console.error(`📋 Response status:`, error.response.status);
          console.error(
            `📋 Response data:`,
            JSON.stringify(error.response.data, null, 2),
          );
        }
        return res.status(500).json({ error: 'Webhook forwarding failed' });
      }
    }
    next();
  });

  // Логирование для правильного пути
  app.use(
    '/jira/process-webhook-before-after',
    (req: any, res: any, next: any) => {
      console.log(`📥 WEBHOOK PROCESSING: ${req.method} ${req.url}`);
      console.log(`📋 Body received:`, !!req.body ? 'YES' : 'NO');
      next();
    },
  );

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Kanban AI Agent - Jira Integration API')
    .setDescription('API для управления задачами в Jira через Kanban интерфейс')
    .setVersion('1.0')
    .addTag('jira', 'Операции с Jira')
    .addTag('health', 'Проверка состояния')
    .addTag('tasks', 'Управление задачами')
    .addTag('columns', 'Работа с колонками')
    .addTag('search', 'Поиск задач')
    .addTag('comments', 'Комментарии к задачам')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Kanban AI Agent API',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Получаем порт из конфигурации
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI is available at: http://localhost:${port}/api`);
}
bootstrap();
