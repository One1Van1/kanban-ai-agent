"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
const axios = require("axios");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use('/', async (req, res, next) => {
        if (req.method === 'POST' && req.url.includes('triggeredByUser')) {
            console.log(`🌐 WEBHOOK RECEIVED ON ROOT PATH: ${req.method} ${req.url}`);
            console.log(`📦 Body size:`, JSON.stringify(req.body).length, 'characters');
            console.log(`🔄 FORWARDING TO CORRECT ENDPOINT`);
            try {
                console.log(`📋 Webhook event:`, req.body.webhookEvent);
                console.log(`🎯 Task key:`, req.body.issue?.key);
                console.log(`📊 Status:`, req.body.issue?.fields?.status?.name);
                console.log(`👤 Assignee:`, req.body.issue?.fields?.assignee?.displayName, '|', req.body.issue?.fields?.assignee?.accountId);
                const targetEndpoint = '/jira/webhook';
                console.log(`🎯 Routing to UNIVERSAL webhook handler: ${targetEndpoint}`);
                const response = await axios.default.post(`http://localhost:3000${targetEndpoint}`, req.body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                });
                console.log(`✅ WEBHOOK FORWARDED SUCCESSFULLY`);
                return res.status(response.status).json(response.data);
            }
            catch (error) {
                console.error(`❌ ERROR FORWARDING WEBHOOK:`, error.message);
                if (error.response) {
                    console.error(`📋 Response status:`, error.response.status);
                    console.error(`📋 Response data:`, JSON.stringify(error.response.data, null, 2));
                }
                return res.status(500).json({ error: 'Webhook forwarding failed' });
            }
        }
        next();
    });
    app.use('/jira/process-webhook-before-after', (req, res, next) => {
        console.log(`📥 WEBHOOK PROCESSING: ${req.method} ${req.url}`);
        console.log(`📋 Body received:`, !!req.body ? 'YES' : 'NO');
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
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
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('app.port') || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger UI is available at: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map