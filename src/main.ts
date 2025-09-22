import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
