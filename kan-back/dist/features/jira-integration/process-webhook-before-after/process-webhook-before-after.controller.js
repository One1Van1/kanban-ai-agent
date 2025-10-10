"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProcessWebhookBeforeAfterController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessWebhookBeforeAfterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const process_webhook_before_after_service_1 = require("./process-webhook-before-after.service");
const process_webhook_before_after_dto_1 = require("./process-webhook-before-after.dto");
let ProcessWebhookBeforeAfterController = ProcessWebhookBeforeAfterController_1 = class ProcessWebhookBeforeAfterController {
    processWebhookBeforeAfterService;
    logger = new common_1.Logger(ProcessWebhookBeforeAfterController_1.name);
    constructor(processWebhookBeforeAfterService) {
        this.processWebhookBeforeAfterService = processWebhookBeforeAfterService;
    }
    async processWebhookBeforeAfter(webhookDto) {
        const taskKey = webhookDto.issue?.key;
        this.logger.log(`🎯 Claude webhook received: ${webhookDto.webhookEvent} for task ${taskKey}`);
        try {
            const result = await this.processWebhookBeforeAfterService.processWebhookBeforeAfter(webhookDto);
            if (result.success && result.processed) {
                this.logger.log(`✅ Claude analysis completed for ${taskKey}: Score ${result.analysis?.quality?.overallScore}/10`);
            }
            else {
                this.logger.log(`⏩ Skipped processing for ${taskKey}: ${result.message}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Claude webhook failed for ${taskKey}:`, error.message);
            return {
                success: false,
                message: 'Webhook processing failed',
                processed: false,
                taskKey,
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getHealth() {
        try {
            const healthStatus = await this.processWebhookBeforeAfterService.getServiceHealth();
            this.logger.log('🏥 Health check requested');
            return healthStatus;
        }
        catch (error) {
            this.logger.error('❌ Health check failed:', error.message);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getConfig() {
        return {
            triggerStatuses: ['Review', 'Testing', 'Done'],
            haircutKeywords: [
                'стрижк',
                'haircut',
                'причёск',
                'парикмахер',
                'hair',
                'волос',
                'укладк',
                'стиль',
                'подстриг',
                'окрашивание',
                'маникюр',
            ],
            maxPhotoSize: '10MB',
            allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
            analysisTimeout: '60 seconds',
            endpointVersion: 'Claude 3.5 Sonnet Vision API',
        };
    }
};
exports.ProcessWebhookBeforeAfterController = ProcessWebhookBeforeAfterController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Новый Claude webhook для анализа фотографий ДО/ПОСЛЕ',
        description: 'Автоматически анализирует задачи по стрижкам с помощью Claude 3.5 Sonnet Vision API',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Webhook успешно обработан',
        type: process_webhook_before_after_dto_1.ProcessWebhookBeforeAfterResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Некорректные данные webhook',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Внутренняя ошибка при обработке webhook',
    }),
    (0, swagger_1.ApiBody)({
        type: process_webhook_before_after_dto_1.ProcessWebhookBeforeAfterDto,
        description: 'Данные webhook от Jira для Claude анализа',
        examples: {
            'webhook-example': {
                summary: 'Пример Jira webhook для стрижки',
                value: {
                    webhookEvent: 'jira:issue_updated',
                    timestamp: 1695454800000,
                    issue: {
                        key: 'KAN-123',
                        id: '10001',
                        fields: {
                            summary: 'Женская стрижка каскад',
                            description: 'Стрижка для постоянной клиентки',
                            status: {
                                name: 'Review',
                                id: '3',
                            },
                            assignee: {
                                displayName: 'Мария Иванова',
                                accountId: 'acc-123',
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_webhook_before_after_dto_1.ProcessWebhookBeforeAfterDto]),
    __metadata("design:returntype", Promise)
], ProcessWebhookBeforeAfterController.prototype, "processWebhookBeforeAfter", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Проверка состояния Claude webhook сервиса',
        description: 'Возвращает статус сервиса и доступность зависимостей',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Статус сервиса',
        schema: {
            example: {
                status: 'healthy',
                claudeEndpoint: 'http://localhost:3000/photo-analysis/analyze-before-after',
                timestamp: '2025-09-26T17:30:00.000Z',
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProcessWebhookBeforeAfterController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить конфигурацию Claude webhook',
        description: 'Возвращает текущую конфигурацию: статусы-триггеры, ключевые слова и настройки',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Конфигурация webhook',
        schema: {
            example: {
                triggerStatuses: ['Review', 'Testing', 'Done'],
                haircutKeywords: ['стрижк', 'haircut', 'причёск', 'парикмахер'],
                maxPhotoSize: '10MB',
                allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProcessWebhookBeforeAfterController.prototype, "getConfig", null);
exports.ProcessWebhookBeforeAfterController = ProcessWebhookBeforeAfterController = ProcessWebhookBeforeAfterController_1 = __decorate([
    (0, swagger_1.ApiTags)('Jira Webhook - Claude Before/After Analysis'),
    (0, common_1.Controller)('jira/process-webhook-before-after'),
    __metadata("design:paramtypes", [process_webhook_before_after_service_1.ProcessWebhookBeforeAfterService])
], ProcessWebhookBeforeAfterController);
//# sourceMappingURL=process-webhook-before-after.controller.js.map