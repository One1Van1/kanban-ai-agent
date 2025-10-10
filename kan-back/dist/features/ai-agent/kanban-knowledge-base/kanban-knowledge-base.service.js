"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KanbanKnowledgeBaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanKnowledgeBaseService = void 0;
const common_1 = require("@nestjs/common");
let KanbanKnowledgeBaseService = KanbanKnowledgeBaseService_1 = class KanbanKnowledgeBaseService {
    logger = new common_1.Logger(KanbanKnowledgeBaseService_1.name);
    patterns = [
        {
            name: 'Critical Bug Flow',
            description: 'Ускоренный процесс для критических багов',
            triggers: ['bug', 'critical', 'production'],
            actions: [
                'Немедленно уведомить команду',
                'Назначить старшего разработчика',
                'Создать hotfix ветку',
                'Уведомить стейкхолдеров',
            ],
            successCriteria: [
                'Исправление в течение 4 часов',
                'Уведомления отправлены всем заинтересованным',
                'Документация обновлена',
            ],
            riskFactors: [
                'Недостаток информации о баге',
                'Отсутствие ответственного разработчика',
                'Сложность воспроизведения',
            ],
            examples: [
                'Падение продакшн сервиса',
                'Критическая уязвимость безопасности',
                'Блокирующий баг для клиентов',
            ],
        },
        {
            name: 'Feature Development Flow',
            description: 'Стандартный процесс разработки новых функций',
            triggers: ['feature', 'enhancement', 'new'],
            actions: [
                'Провести планирование',
                'Создать техническое задание',
                'Назначить ответственного',
                'Запланировать ревью',
            ],
            successCriteria: [
                'ТЗ утверждено',
                'Временные рамки определены',
                'Ресурсы выделены',
            ],
            riskFactors: [
                'Неясные требования',
                'Недооценка сложности',
                'Зависимости от других команд',
            ],
            examples: [
                'Новая страница в приложении',
                'Интеграция с внешним API',
                'Улучшение UI/UX',
            ],
        },
        {
            name: 'Testing Phase Flow',
            description: 'Процесс тестирования задач',
            triggers: ['testing', 'qa', 'review'],
            actions: [
                'Назначить тестировщика',
                'Создать тест-кейсы',
                'Провести тестирование',
                'Документировать результаты',
            ],
            successCriteria: [
                'Все тесты пройдены',
                'Баги задокументированы',
                'Готовность к релизу',
            ],
            riskFactors: [
                'Недостаток времени на тестирование',
                'Неполное покрытие тестами',
                'Сложность настройки тестовой среды',
            ],
            examples: [
                'Функциональное тестирование',
                'Регрессионное тестирование',
                'Нагрузочное тестирование',
            ],
        },
    ];
    businessRules = [
        {
            id: 'critical-bug-notification',
            name: 'Уведомление о критических багах',
            condition: 'taskType === "bug" && priority === "critical"',
            action: 'Отправить уведомление команде и стейкхолдерам',
            priority: 1,
            applicableColumns: ['To Do', 'In Progress'],
            taskTypes: ['bug'],
        },
        {
            id: 'high-priority-assignment',
            name: 'Назначение высокоприоритетных задач',
            condition: 'priority === "high" && assignee === null',
            action: 'Назначить старшего разработчика',
            priority: 2,
            applicableColumns: ['To Do', 'Backlog'],
            taskTypes: ['bug', 'feature', 'task'],
        },
        {
            id: 'testing-readiness-check',
            name: 'Проверка готовности к тестированию',
            condition: 'column === "Ready for Testing"',
            action: 'Проверить критерии готовности и назначить тестировщика',
            priority: 3,
            applicableColumns: ['Ready for Testing'],
            taskTypes: ['feature', 'bug', 'improvement'],
        },
        {
            id: 'blocked-task-escalation',
            name: 'Эскалация заблокированных задач',
            condition: 'status === "blocked" && blockedDays > 2',
            action: 'Эскалировать менеджеру проекта',
            priority: 1,
            applicableColumns: ['In Progress', 'Blocked'],
            taskTypes: ['all'],
        },
    ];
    industryPractices = [
        {
            industry: 'Software Development',
            practice: 'Definition of Done',
            description: 'Четкие критерии завершенности задач',
            implementation: [
                'Код написан и отревьюен',
                'Тесты написаны и проходят',
                'Документация обновлена',
                'Фича протестирована',
            ],
            benefits: [
                'Единое понимание готовности',
                'Повышение качества',
                'Уменьшение багов',
            ],
        },
        {
            industry: 'Agile Teams',
            practice: 'WIP Limits',
            description: 'Ограничение количества задач в работе',
            implementation: [
                'Установить лимиты для каждой колонки',
                'Мониторить соблюдение лимитов',
                'Фокусироваться на завершении задач',
            ],
            benefits: [
                'Улучшение flow',
                'Снижение времени выполнения',
                'Повышение качества',
            ],
        },
    ];
    findMatchingPattern(taskType, keywords, columnName) {
        this.logger.log(`🔍 Searching pattern for: ${taskType}, keywords: ${keywords.join(', ')}, column: ${columnName}`);
        for (const pattern of this.patterns) {
            const matchScore = this.calculatePatternMatch(pattern, taskType, keywords);
            if (matchScore > 0.6) {
                this.logger.log(`✅ Found matching pattern: ${pattern.name} (score: ${matchScore})`);
                return pattern;
            }
        }
        this.logger.log('❌ No matching pattern found');
        return null;
    }
    getApplicableBusinessRules(taskType, columnName, taskData) {
        this.logger.log(`📋 Getting business rules for: ${taskType} in ${columnName}`);
        return this.businessRules
            .filter((rule) => {
            const columnApplicable = rule.applicableColumns.includes(columnName) ||
                rule.applicableColumns.includes('all');
            const typeApplicable = rule.taskTypes.includes(taskType) || rule.taskTypes.includes('all');
            return columnApplicable && typeApplicable;
        })
            .sort((a, b) => a.priority - b.priority);
    }
    getIndustryBestPractices(industry = 'Software Development') {
        return this.industryPractices.filter((practice) => practice.industry === industry || practice.industry === 'General');
    }
    getOptimizationRecommendations(taskType, columnName, timeInColumn) {
        const recommendations = [];
        if (timeInColumn > 72) {
            recommendations.push('Задача слишком долго в колонке - проверить блокеры');
            recommendations.push('Рассмотреть разбиение на подзадачи');
        }
        if (taskType === 'bug' && columnName === 'To Do') {
            recommendations.push('Баги должны приоритизироваться выше обычных задач');
        }
        if (taskType === 'epic' && columnName === 'In Progress') {
            recommendations.push('Epic слишком крупный - разбить на задачи');
        }
        if (columnName === 'In Progress') {
            recommendations.push('Проверить WIP лимиты');
            recommendations.push('Убедиться в наличии ответственного');
        }
        if (columnName === 'Testing') {
            recommendations.push('Назначить тестировщика');
            recommendations.push('Подготовить тестовые данные');
        }
        return recommendations;
    }
    calculatePatternMatch(pattern, taskType, keywords) {
        let score = 0;
        const maxScore = pattern.triggers.length;
        for (const trigger of pattern.triggers) {
            if (taskType.toLowerCase().includes(trigger.toLowerCase())) {
                score += 1;
            }
            for (const keyword of keywords) {
                if (keyword.toLowerCase().includes(trigger.toLowerCase())) {
                    score += 0.5;
                }
            }
        }
        return maxScore > 0 ? score / maxScore : 0;
    }
    addPattern(pattern) {
        this.patterns.push(pattern);
        this.logger.log(`📚 Added new pattern: ${pattern.name}`);
    }
    addBusinessRule(rule) {
        this.businessRules.push(rule);
        this.logger.log(`📋 Added new business rule: ${rule.name}`);
    }
    addBestPractice(practice) {
        this.industryPractices.push(practice);
        this.logger.log(`🏭 Added new best practice: ${practice.practice}`);
    }
    getKnowledgeBaseStats() {
        return {
            patterns: this.patterns.length,
            businessRules: this.businessRules.length,
            bestPractices: this.industryPractices.length,
        };
    }
};
exports.KanbanKnowledgeBaseService = KanbanKnowledgeBaseService;
exports.KanbanKnowledgeBaseService = KanbanKnowledgeBaseService = KanbanKnowledgeBaseService_1 = __decorate([
    (0, common_1.Injectable)()
], KanbanKnowledgeBaseService);
//# sourceMappingURL=kanban-knowledge-base.service.js.map