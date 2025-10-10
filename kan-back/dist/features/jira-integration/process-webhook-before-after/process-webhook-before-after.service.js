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
var ProcessWebhookBeforeAfterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessWebhookBeforeAfterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let ProcessWebhookBeforeAfterService = ProcessWebhookBeforeAfterService_1 = class ProcessWebhookBeforeAfterService {
    configService;
    logger = new common_1.Logger(ProcessWebhookBeforeAfterService_1.name);
    baseUrl;
    processingTasks = new Set();
    constructor(configService) {
        this.configService = configService;
        this.baseUrl =
            this.configService.get('app.baseUrl') || 'http://localhost:3000';
    }
    async processWebhookBeforeAfter(dto) {
        const { issue, webhookEvent } = dto;
        const taskKey = issue?.key;
        this.logger.log(`🎯 Processing Claude webhook: ${webhookEvent} for task ${taskKey}`);
        if (this.processingTasks.has(taskKey)) {
            this.logger.warn(`🔒 Task ${taskKey} is already being processed, skipping`);
            return {
                success: true,
                message: 'Task is already being processed',
                processed: false,
                taskKey,
                timestamp: new Date().toISOString(),
            };
        }
        this.processingTasks.add(taskKey);
        try {
            const validationResult = await this.validateClaudeConditions(dto);
            if (!validationResult.shouldProcess) {
                this.processingTasks.delete(taskKey);
                return {
                    success: true,
                    message: validationResult.reason,
                    processed: false,
                    taskKey,
                    timestamp: new Date().toISOString(),
                };
            }
            const photosResult = await this.extractBeforeAfterPhotos(taskKey);
            if (!photosResult.success) {
                this.logger.warn(`📷 No photos found for ${taskKey}: ${photosResult.message}`);
                await this.moveTaskToQuestionsWithComment(taskKey);
                this.processingTasks.delete(taskKey);
                return {
                    success: true,
                    message: `Task moved to Questions: no photos found`,
                    processed: true,
                    taskKey,
                    timestamp: new Date().toISOString(),
                };
            }
            const claudeResult = await this.analyzeWithClaude(taskKey, photosResult);
            await this.postResultsToJira(taskKey, claudeResult);
            await this.moveTaskToDone(taskKey);
            this.logger.log(`✅ Claude webhook completed for ${taskKey}`);
            return {
                success: true,
                message: 'Claude analysis completed successfully',
                processed: true,
                taskKey,
                analysis: claudeResult.analysis || undefined,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`❌ Claude webhook failed for ${taskKey}:`, error.message);
            return {
                success: false,
                message: 'Claude webhook processing failed',
                processed: false,
                taskKey,
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
        finally {
            this.processingTasks.delete(taskKey);
        }
    }
    async validateClaudeConditions(dto) {
        const { issue, webhookEvent } = dto;
        const taskKey = issue?.key;
        if (!['jira:issue_updated'].includes(webhookEvent)) {
            return {
                shouldProcess: false,
                reason: `Event type ${webhookEvent} not supported for Claude analysis`,
            };
        }
        const haircutKeywords = [
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
        ];
        const summary = (issue?.fields?.summary || '').toLowerCase();
        const description = (issue?.fields?.description || '').toLowerCase();
        const hasHaircutKeywords = haircutKeywords.some((keyword) => summary.includes(keyword) || description.includes(keyword));
        if (!hasHaircutKeywords) {
            return {
                shouldProcess: false,
                reason: 'Task does not contain haircut-related keywords',
            };
        }
        const currentStatus = issue?.fields?.status?.name;
        const triggerStatuses = ['Review', 'Testing', 'Done'];
        if (!triggerStatuses.includes(currentStatus)) {
            return {
                shouldProcess: false,
                reason: `Status ${currentStatus} not in trigger list [${triggerStatuses.join(', ')}]`,
            };
        }
        const hasExistingAnalysis = await this.checkExistingClaudeAnalysis(taskKey);
        if (hasExistingAnalysis) {
            const hasPhotosNow = await this.hasPhotoAttachments(taskKey);
            const hasNoResultComment = await this.hasNoResultComment(taskKey);
            if (hasNoResultComment && hasPhotosNow) {
                this.logger.log(`🔄 Re-processing ${taskKey}: photos added after 'no result' analysis`);
                return {
                    shouldProcess: true,
                    reason: 'Photos added after previous no-result analysis',
                };
            }
            const hasSuccessfulAnalysis = await this.hasSuccessfulClaudeAnalysis(taskKey);
            if (hasSuccessfulAnalysis && currentStatus !== 'Done') {
                this.logger.log(`✅ Found successful Claude analysis for ${taskKey}, moving to Done`);
                await this.moveTaskToDone(taskKey);
                return {
                    shouldProcess: false,
                    reason: 'Task moved to Done: successful analysis already exists',
                };
            }
            return {
                shouldProcess: false,
                reason: 'Claude analysis already exists for this task',
            };
        }
        return {
            shouldProcess: true,
            reason: 'All conditions met for Claude analysis',
        };
    }
    async checkExistingClaudeAnalysis(taskKey) {
        try {
            const jiraConfig = {
                baseURL: this.configService.get('jira.baseUrl'),
                auth: {
                    username: this.configService.get('jira.email') || '',
                    password: this.configService.get('jira.apiToken') || '',
                },
            };
            const response = await axios_1.default.get(`/rest/api/3/issue/${taskKey}/comment`, jiraConfig);
            const comments = response.data.comments || [];
            const hasClaudeAnalysis = comments.some((comment) => {
                const bodyText = typeof comment.body === 'string'
                    ? comment.body
                    : comment.body?.content
                        ? comment.body.content
                            .map((c) => c.content?.map((t) => t.text || '').join('') || '')
                            .join('')
                        : '';
                return (bodyText &&
                    (bodyText.includes('АНАЛИЗ CLAUDE') ||
                        bodyText.includes('Claude Vision API') ||
                        bodyText.includes('🤖')));
            });
            if (hasClaudeAnalysis) {
                this.logger.log(`🔍 Found existing Claude analysis for ${taskKey}`);
            }
            return hasClaudeAnalysis;
        }
        catch (error) {
            this.logger.warn(`Failed to check existing comments for ${taskKey}: ${error.message}`);
            return false;
        }
    }
    async extractBeforeAfterPhotos(taskKey) {
        try {
            const jiraConfig = {
                baseURL: this.configService.get('jira.baseUrl'),
                auth: {
                    username: this.configService.get('jira.email') || '',
                    password: this.configService.get('jira.apiToken') || '',
                },
            };
            const response = await axios_1.default.get(`/rest/api/3/issue/${taskKey}?expand=attachment`, jiraConfig);
            const attachments = response.data.fields.attachment || [];
            if (attachments.length === 0) {
                return { success: false, message: 'No attachments found' };
            }
            const imageAttachments = attachments.filter((att) => att.mimeType && att.mimeType.startsWith('image/'));
            if (imageAttachments.length < 2) {
                return {
                    success: false,
                    message: `Need at least 2 photos, found ${imageAttachments.length}`,
                };
            }
            const beforeKeywords = ['before', 'до', 'pre', 'исходн', 'начальн'];
            const afterKeywords = [
                'after',
                'после',
                'post',
                'result',
                'итог',
                'финальн',
            ];
            let beforePhoto = imageAttachments.find((att) => beforeKeywords.some((keyword) => att.filename.toLowerCase().includes(keyword)));
            let afterPhoto = imageAttachments.find((att) => afterKeywords.some((keyword) => att.filename.toLowerCase().includes(keyword)));
            if (!beforePhoto || !afterPhoto) {
                this.logger.log('🕒 Photos not found by keywords, using time-based detection');
                const sortedByTime = imageAttachments.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
                beforePhoto = sortedByTime[0];
                afterPhoto = sortedByTime[sortedByTime.length - 1];
                this.logger.log(`📷 Auto-detected: Before="${beforePhoto.filename}" (${beforePhoto.created}), After="${afterPhoto.filename}" (${afterPhoto.created})`);
            }
            if (!beforePhoto || !afterPhoto) {
                return {
                    success: false,
                    message: `Missing photos - Before: ${beforePhoto ? 'found' : 'missing'}, After: ${afterPhoto ? 'found' : 'missing'}`,
                };
            }
            const beforeContent = await this.downloadPhotoAsBase64(beforePhoto.content, jiraConfig);
            const afterContent = await this.downloadPhotoAsBase64(afterPhoto.content, jiraConfig);
            return {
                success: true,
                message: 'Photos extracted successfully',
                beforePhoto: {
                    filename: beforePhoto.filename,
                    content: beforeContent,
                    url: beforePhoto.content,
                },
                afterPhoto: {
                    filename: afterPhoto.filename,
                    content: afterContent,
                    url: afterPhoto.content,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error extracting photos from ${taskKey}:`, error.message);
            return {
                success: false,
                message: `Photo extraction failed: ${error.message}`,
            };
        }
    }
    async downloadPhotoAsBase64(photoUrl, jiraConfig) {
        try {
            const response = await axios_1.default.get(photoUrl, {
                ...jiraConfig,
                responseType: 'arraybuffer',
            });
            const buffer = Buffer.from(response.data);
            return buffer.toString('base64');
        }
        catch (error) {
            this.logger.error(`Error downloading photo from ${photoUrl}:`, error.message);
            throw new Error(`Photo download failed: ${error.message}`);
        }
    }
    async analyzeWithClaude(taskKey, photosResult) {
        try {
            const claudeRequest = {
                taskKey,
                beforePhoto: photosResult.beforePhoto.content,
                afterPhoto: photosResult.afterPhoto.content,
                declaredCategory: 'Автоматический анализ через webhook',
            };
            this.logger.log(`📸 Sending photos to Claude for analysis: ${taskKey}`);
            const response = await axios_1.default.post(`${this.baseUrl}/photo-analysis/analyze-before-after`, claudeRequest, {
                timeout: 60000,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.success) {
                return {
                    success: true,
                    message: 'Claude analysis completed',
                    analysis: response.data.analysis,
                };
            }
            else {
                throw new Error(response.data.message || 'Claude analysis failed');
            }
        }
        catch (error) {
            this.logger.error(`Claude analysis failed for ${taskKey}:`, error.message);
            return {
                success: false,
                message: `Claude analysis error: ${error.message}`,
                analysis: null,
            };
        }
    }
    async postResultsToJira(taskKey, claudeResult) {
        if (!claudeResult.success || !claudeResult.analysis) {
            this.logger.warn(`Skipping Jira comment for ${taskKey}: no analysis results`);
            return;
        }
        this.logger.log(`📝 Adding Claude analysis comment for ${taskKey}`);
        try {
            const analysis = claudeResult.analysis;
            const comment = `🤖 *АНАЛИЗ CLAUDE 3.5 SONNET* 🤖

📊 *РЕЗУЛЬТАТ АНАЛИЗА СТРИЖКИ*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Информация о клиенте:*
• Пол: ${analysis.clientInfo?.gender || 'не определен'}
• Стиль стрижки: ${analysis.clientInfo?.haircutStyle || 'стандартная'}

🎯 *Категория:* ${analysis.transformation.category}
⭐ *Общая оценка:* ${analysis.quality.overallScore}/10
📊 *Сложность:* ${analysis.transformation.difficultyLevel}/10

🔍 *Детальная оценка:*
• Ровность стрижки: ${analysis.quality.evenness}/10
• Переходы: ${analysis.quality.transitions}/10  
• Симметрия: ${analysis.quality.symmetry}/10
• Чистота работы: ${analysis.quality.cleanliness}/10
• Соответствие стилю: ${analysis.quality.styleCompliance}/10

📝 *Визуальные изменения:*
${analysis.transformation.visualChanges.map((change) => `• ${change}`).join('\n')}

🛠️ *Техника выполнения:*
${analysis.transformation.technique}

💡 *Рекомендации для улучшения:*
${analysis.recommendations.map((rec) => `• ${rec}`).join('\n')}

🤖 *Анализ выполнен автоматически через Claude Vision API*`;
            await axios_1.default.post(`${this.baseUrl}/jira/tasks/${taskKey}/comment`, { comment }, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' },
            });
            this.logger.log(`💬 Claude results posted to ${taskKey}`);
        }
        catch (error) {
            this.logger.error(`Failed to post results to ${taskKey}:`, error.message);
            throw error;
        }
    }
    async moveTaskToQuestionsWithComment(taskKey) {
        try {
            const comment = `❌ **НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ**

📷 В задаче отсутствуют фотографии результата работы (до/после).
Пожалуйста, прикрепите фотографии для анализа качества.

🤖 *Автоматическая проверка системы*`;
            await axios_1.default.post(`${this.baseUrl}/jira/tasks/${taskKey}/comment`, { comment }, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' },
            });
            await axios_1.default.post(`${this.baseUrl}/jira/tasks/${taskKey}/move`, { targetStatus: 'Questions' }, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' },
            });
            this.logger.log(`🔄 Task ${taskKey} moved to Questions: no photos found`);
        }
        catch (error) {
            this.logger.error(`Failed to move ${taskKey} to Questions:`, error.message);
            throw error;
        }
    }
    async moveTaskToDone(taskKey) {
        try {
            await axios_1.default.post(`${this.baseUrl}/jira/tasks/${taskKey}/move`, { targetColumn: 'Done' }, {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' },
            });
            this.logger.log(`✅ Task ${taskKey} moved to Done after successful analysis`);
        }
        catch (error) {
            this.logger.error(`Failed to move ${taskKey} to Done:`, error.message);
            throw error;
        }
    }
    async hasPhotoAttachments(taskKey) {
        try {
            const jiraConfig = {
                baseURL: this.configService.get('jira.baseUrl'),
                auth: {
                    username: this.configService.get('jira.email') || '',
                    password: this.configService.get('jira.apiToken') || '',
                },
            };
            const response = await axios_1.default.get(`/rest/api/3/issue/${taskKey}`, jiraConfig);
            const attachments = response.data.fields?.attachment || [];
            return attachments.length > 0;
        }
        catch (error) {
            this.logger.error(`Failed to check photos for ${taskKey}:`, error.message);
            return false;
        }
    }
    async hasNoResultComment(taskKey) {
        try {
            const jiraConfig = {
                baseURL: this.configService.get('jira.baseUrl'),
                auth: {
                    username: this.configService.get('jira.email') || '',
                    password: this.configService.get('jira.apiToken') || '',
                },
            };
            const response = await axios_1.default.get(`/rest/api/3/issue/${taskKey}/comment`, jiraConfig);
            const comments = response.data.comments || [];
            return comments.some((comment) => {
                const bodyText = typeof comment.body === 'string'
                    ? comment.body
                    : comment.body?.content
                        ? comment.body.content
                            .map((c) => c.content?.map((t) => t.text || '').join('') || '')
                            .join('')
                        : '';
                return (bodyText && bodyText.includes('НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ'));
            });
        }
        catch (error) {
            this.logger.error(`Failed to check comments for ${taskKey}:`, error.message);
            return false;
        }
    }
    async hasSuccessfulClaudeAnalysis(taskKey) {
        try {
            const jiraConfig = {
                baseURL: this.configService.get('jira.baseUrl'),
                auth: {
                    username: this.configService.get('jira.email') || '',
                    password: this.configService.get('jira.apiToken') || '',
                },
            };
            const response = await axios_1.default.get(`/rest/api/3/issue/${taskKey}/comment`, jiraConfig);
            const comments = response.data.comments || [];
            const hasClaudeAnalysis = comments.some((comment) => {
                const bodyText = typeof comment.body === 'string'
                    ? comment.body
                    : comment.body?.content
                        ? comment.body.content
                            .map((c) => c.content?.map((t) => t.text || '').join('') || '')
                            .join('')
                        : '';
                return (bodyText &&
                    (bodyText.includes('АНАЛИЗ CLAUDE') ||
                        bodyText.includes('Claude Vision API') ||
                        bodyText.includes('🤖')) &&
                    !bodyText.includes('НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ'));
            });
            if (hasClaudeAnalysis) {
                this.logger.log(`✅ Found successful Claude analysis for ${taskKey}`);
            }
            return hasClaudeAnalysis;
        }
        catch (error) {
            this.logger.warn(`Failed to check successful analysis for ${taskKey}: ${error.message}`);
            return false;
        }
    }
    async getServiceHealth() {
        return {
            status: 'healthy',
            claudeEndpoint: `${this.baseUrl}/photo-analysis-agent/analyze-before-after-photos`,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.ProcessWebhookBeforeAfterService = ProcessWebhookBeforeAfterService;
exports.ProcessWebhookBeforeAfterService = ProcessWebhookBeforeAfterService = ProcessWebhookBeforeAfterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ProcessWebhookBeforeAfterService);
//# sourceMappingURL=process-webhook-before-after.service.js.map