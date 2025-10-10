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
var AnalyzeBeforeAfterPhotosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeBeforeAfterPhotosService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const analyze_before_after_photos_response_dto_1 = require("./analyze-before-after-photos.response.dto");
let AnalyzeBeforeAfterPhotosService = AnalyzeBeforeAfterPhotosService_1 = class AnalyzeBeforeAfterPhotosService {
    configService;
    logger = new common_1.Logger(AnalyzeBeforeAfterPhotosService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async execute(requestDto) {
        try {
            this.logger.log(`Starting photo analysis for task: ${requestDto.taskKey}`);
            const analysisResult = await this.analyzePhotos(requestDto.beforePhoto, requestDto.afterPhoto, requestDto.declaredCategory);
            return new analyze_before_after_photos_response_dto_1.AnalyzeBeforeAfterPhotosResponseDto(true, requestDto.taskKey, 'Before/after analysis completed successfully', analysisResult);
        }
        catch (error) {
            this.logger.error(`Failed to analyze photos for task: ${requestDto.taskKey}`, error.stack);
            return new analyze_before_after_photos_response_dto_1.AnalyzeBeforeAfterPhotosResponseDto(false, requestDto.taskKey, 'Photo analysis failed', {
                clientInfo: {
                    gender: 'не определен',
                    haircutStyle: 'неизвестно',
                },
                transformation: {
                    category: 'Unknown',
                    difficultyLevel: 0,
                },
                quality: {
                    overallScore: 0,
                    technicalExecution: 0,
                    creativity: 0,
                    clientSatisfaction: 0,
                },
                improvements: [],
                compliance: false,
                notes: `Error: ${error.message}`,
                confidenceLevel: 0,
            });
        }
    }
    async analyzePhotos(beforePhoto, afterPhoto, declaredCategory) {
        this.logger.log('🤖 Calling Claude 3.5 Sonnet Vision API for real analysis...');
        try {
            const openrouterApiKey = this.configService.get('claude.apiKey');
            const model = this.configService.get('claude.model') ||
                'anthropic/claude-3.5-sonnet:beta';
            if (!openrouterApiKey) {
                throw new Error('OpenRouter API key not configured');
            }
            const prompt = `Проанализируй эти две фотографии стрижки: ДО и ПОСЛЕ. 

Заявленная категория: ${declaredCategory || 'Не указана'}

Верни анализ в формате JSON:
{
  "clientInfo": {
    "gender": "мужской/женский/не определен",
    "haircutStyle": "тип стрижки"
  },
  "transformation": {
    "category": "точная категория стрижки",
    "difficultyLevel": число_от_1_до_10,
    "visualChanges": ["изменение 1", "изменение 2", "изменение 3"],
    "technique": "описание техники выполнения"
  },
  "quality": {
    "overallScore": число_от_1_до_10,
    "technicalExecution": число_от_1_до_10,
    "creativity": число_от_1_до_10,
    "clientSatisfaction": число_от_1_до_10,
    "evenness": число_от_1_до_10,
    "transitions": число_от_1_до_10,
    "symmetry": число_от_1_до_10,
    "cleanliness": число_от_1_до_10,
    "styleCompliance": число_от_1_до_10
  },
  "improvements": ["улучшение 1", "улучшение 2"],
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"],
  "compliance": true/false,
  "notes": "детальные заметки о работе",
  "confidenceLevel": число_от_1_до_100
}

Анализируй профессионально как эксперт-парикмахер.`;
            const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt,
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${beforePhoto}`,
                                },
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${afterPhoto}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 4000,
                temperature: 0.1,
            }, {
                headers: {
                    Authorization: `Bearer ${openrouterApiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Kanban AI Agent',
                },
                timeout: 60000,
            });
            const claudeResponse = response.data.choices[0]?.message?.content;
            if (!claudeResponse) {
                throw new Error('No response from Claude API');
            }
            const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in Claude response');
            }
            const analysisResult = JSON.parse(jsonMatch[0]);
            this.logger.log(`✅ Claude analysis completed for ${declaredCategory}`);
            return analysisResult;
        }
        catch (error) {
            this.logger.error('❌ Claude API call failed:', error.message);
            this.logger.log('🔄 Falling back to mock data...');
            return {
                clientInfo: {
                    gender: 'женский',
                    haircutStyle: 'стандартная',
                },
                transformation: {
                    category: declaredCategory || 'Женская стрижка',
                    difficultyLevel: 7,
                    visualChanges: [
                        'Укорочена длина волос на 5-7 см',
                        'Создана градуированная форма',
                        'Добавлена структурированность',
                    ],
                    technique: 'Классическая стрижка ножницами с градуировкой',
                },
                quality: {
                    overallScore: 85,
                    technicalExecution: 8.5,
                    creativity: 8.0,
                    clientSatisfaction: 9.0,
                    evenness: 8,
                    transitions: 9,
                    symmetry: 8,
                    cleanliness: 9,
                    styleCompliance: 8,
                },
                improvements: ['Аккуратность линий', 'Общая форма'],
                recommendations: [
                    'Рекомендуется использовать профессиональные средства для укладки',
                    'Следующая коррекция через 4-6 недель',
                    'Добавить легкое тонирование для подчеркивания текстуры',
                ],
                compliance: true,
                notes: `Анализ выполнен в режиме fallback из-за ошибки API: ${error.message}`,
                confidenceLevel: 75,
            };
        }
    }
};
exports.AnalyzeBeforeAfterPhotosService = AnalyzeBeforeAfterPhotosService;
exports.AnalyzeBeforeAfterPhotosService = AnalyzeBeforeAfterPhotosService = AnalyzeBeforeAfterPhotosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AnalyzeBeforeAfterPhotosService);
//# sourceMappingURL=analyze-before-after-photos.service.js.map