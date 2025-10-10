"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AgentRoleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRoleService = exports.AgentRole = void 0;
const common_1 = require("@nestjs/common");
var AgentRole;
(function (AgentRole) {
    AgentRole["WORKFLOW_OPTIMIZER"] = "workflow_optimizer";
    AgentRole["QUALITY_CONTROLLER"] = "quality_controller";
    AgentRole["PRIORITY_MANAGER"] = "priority_manager";
    AgentRole["STAKEHOLDER_COMMUNICATOR"] = "stakeholder_communicator";
    AgentRole["RESOURCE_ALLOCATOR"] = "resource_allocator";
    AgentRole["RISK_ASSESSOR"] = "risk_assessor";
    AgentRole["PERFORMANCE_ANALYST"] = "performance_analyst";
    AgentRole["UNIVERSAL"] = "universal";
})(AgentRole || (exports.AgentRole = AgentRole = {}));
let AgentRoleService = AgentRoleService_1 = class AgentRoleService {
    logger = new common_1.Logger(AgentRoleService_1.name);
    roleConfigurations = {
        [AgentRole.WORKFLOW_OPTIMIZER]: {
            role: AgentRole.WORKFLOW_OPTIMIZER,
            capabilities: [
                {
                    name: 'Workflow Analysis',
                    description: 'Анализ и оптимизация процессов kanban',
                    applicableColumns: ['all'],
                    taskTypes: ['all'],
                    triggerConditions: ['task_moved', 'task_blocked', 'workflow_issue'],
                    specializations: [
                        'bottleneck_detection',
                        'flow_optimization',
                        'wip_management',
                    ],
                    requiredContexts: [
                        'column_history',
                        'task_dependencies',
                        'team_capacity',
                    ],
                },
                {
                    name: 'Process Improvement',
                    description: 'Предложения по улучшению процессов',
                    applicableColumns: ['Done', 'Blocked'],
                    taskTypes: ['all'],
                    triggerConditions: ['task_completed', 'process_inefficiency'],
                    specializations: ['cycle_time_reduction', 'throughput_improvement'],
                    requiredContexts: ['historical_data', 'team_metrics'],
                },
            ],
            instructions: [
                'Анализируй flow задач и выявляй узкие места',
                'Предлагай оптимизации для улучшения throughput',
                'Мониторь WIP лимиты и предупреждай о их превышении',
                'Выявляй паттерны блокировок и предлагай решения',
            ],
            decisionWeights: {
                efficiency: 0.4,
                flow_optimization: 0.3,
                bottleneck_prevention: 0.2,
                team_satisfaction: 0.1,
            },
            confidenceThresholds: { low: 30, medium: 60, high: 80 },
            escalationRules: [
                'Эскалировать при критических блокировках более 48 часов',
                'Уведомлять руководство при снижении throughput более чем на 30%',
            ],
        },
        [AgentRole.QUALITY_CONTROLLER]: {
            role: AgentRole.QUALITY_CONTROLLER,
            capabilities: [
                {
                    name: 'Quality Assurance',
                    description: 'Контроль качества задач и deliverables',
                    applicableColumns: ['In Review', 'Testing', 'Ready for Production'],
                    taskTypes: ['feature', 'bug', 'improvement'],
                    triggerConditions: [
                        'task_ready_for_review',
                        'quality_check_required',
                    ],
                    specializations: [
                        'code_review',
                        'testing_requirements',
                        'acceptance_criteria',
                    ],
                    requiredContexts: [
                        'task_requirements',
                        'definition_of_done',
                        'quality_metrics',
                    ],
                },
                {
                    name: 'Standards Compliance',
                    description: 'Проверка соответствия стандартам',
                    applicableColumns: ['Testing', 'Done'],
                    taskTypes: ['all'],
                    triggerConditions: ['completion_check', 'standards_validation'],
                    specializations: ['compliance_check', 'documentation_review'],
                    requiredContexts: ['project_standards', 'quality_guidelines'],
                },
            ],
            instructions: [
                'Проверяй соответствие Definition of Done',
                'Валидируй критерии приемки перед завершением',
                'Контролируй качество документации',
                'Обеспечивай соблюдение стандартов кодирования',
            ],
            decisionWeights: {
                quality_standards: 0.5,
                completeness: 0.3,
                documentation: 0.15,
                user_experience: 0.05,
            },
            confidenceThresholds: { low: 40, medium: 70, high: 90 },
            escalationRules: [
                'Блокировать задачи не соответствующие DoD',
                'Эскалировать критические проблемы качества немедленно',
            ],
        },
        [AgentRole.PRIORITY_MANAGER]: {
            role: AgentRole.PRIORITY_MANAGER,
            capabilities: [
                {
                    name: 'Priority Assessment',
                    description: 'Оценка и управление приоритетами задач',
                    applicableColumns: ['Backlog', 'To Do', 'In Progress'],
                    taskTypes: ['all'],
                    triggerConditions: ['new_task', 'priority_change', 'urgency_update'],
                    specializations: [
                        'business_value_assessment',
                        'urgency_evaluation',
                        'dependency_analysis',
                    ],
                    requiredContexts: [
                        'business_priorities',
                        'stakeholder_requirements',
                        'resource_availability',
                    ],
                },
                {
                    name: 'Resource Prioritization',
                    description: 'Приоритизация распределения ресурсов',
                    applicableColumns: ['To Do', 'In Progress'],
                    taskTypes: ['all'],
                    triggerConditions: ['resource_conflict', 'capacity_planning'],
                    specializations: ['capacity_management', 'skill_matching'],
                    requiredContexts: [
                        'team_capacity',
                        'skill_matrix',
                        'current_workload',
                    ],
                },
            ],
            instructions: [
                'Оценивай бизнес-ценность и влияние задач',
                'Балансируй краткосрочные и долгосрочные приоритеты',
                'Учитывай зависимости между задачами при приоритизации',
                'Оптимизируй загрузку команды с учетом приоритетов',
            ],
            decisionWeights: {
                business_value: 0.4,
                urgency: 0.3,
                effort_required: 0.2,
                dependencies: 0.1,
            },
            confidenceThresholds: { low: 35, medium: 65, high: 85 },
            escalationRules: [
                'Эскалировать конфликты приоритетов к Product Owner',
                'Уведомлять о перегрузке команды критическими задачами',
            ],
        },
        [AgentRole.STAKEHOLDER_COMMUNICATOR]: {
            role: AgentRole.STAKEHOLDER_COMMUNICATOR,
            capabilities: [
                {
                    name: 'Stakeholder Notifications',
                    description: 'Уведомления заинтересованных сторон',
                    applicableColumns: ['all'],
                    taskTypes: ['all'],
                    triggerConditions: [
                        'status_change',
                        'milestone_reached',
                        'issue_detected',
                    ],
                    specializations: [
                        'notification_management',
                        'status_reporting',
                        'escalation_communication',
                    ],
                    requiredContexts: [
                        'stakeholder_preferences',
                        'communication_rules',
                        'notification_history',
                    ],
                },
                {
                    name: 'Progress Reporting',
                    description: 'Отчетность по прогрессу',
                    applicableColumns: ['Done', 'In Progress'],
                    taskTypes: ['epic', 'feature'],
                    triggerConditions: ['milestone_completion', 'progress_update'],
                    specializations: ['progress_tracking', 'metric_reporting'],
                    requiredContexts: ['project_milestones', 'progress_metrics'],
                },
            ],
            instructions: [
                'Уведомляй стейкхолдеров о важных изменениях статуса',
                'Предоставляй регулярные отчеты о прогрессе',
                'Адаптируй коммуникацию под предпочтения получателей',
                'Эскалируй критические проблемы соответствующим лицам',
            ],
            decisionWeights: {
                stakeholder_impact: 0.4,
                communication_urgency: 0.3,
                information_relevance: 0.2,
                channel_appropriateness: 0.1,
            },
            confidenceThresholds: { low: 25, medium: 55, high: 80 },
            escalationRules: [
                'Немедленно уведомлять о критических проблемах',
                'Еженедельные сводки для руководства',
            ],
        },
        [AgentRole.RESOURCE_ALLOCATOR]: {
            role: AgentRole.RESOURCE_ALLOCATOR,
            capabilities: [
                {
                    name: 'Resource Assignment',
                    description: 'Назначение ресурсов на задачи',
                    applicableColumns: ['To Do', 'In Progress'],
                    taskTypes: ['all'],
                    triggerConditions: [
                        'unassigned_task',
                        'resource_available',
                        'skill_match',
                    ],
                    specializations: [
                        'skill_matching',
                        'workload_balancing',
                        'capacity_planning',
                    ],
                    requiredContexts: [
                        'team_skills',
                        'current_assignments',
                        'availability',
                    ],
                },
            ],
            instructions: [
                'Назначай задачи наиболее подходящим исполнителям',
                'Балансируй загрузку команды',
                'Учитывай навыки и экспертизу при назначении',
                'Оптимизируй использование ресурсов',
            ],
            decisionWeights: {
                skill_match: 0.4,
                workload_balance: 0.3,
                availability: 0.2,
                development_opportunity: 0.1,
            },
            confidenceThresholds: { low: 40, medium: 70, high: 90 },
            escalationRules: [
                'Эскалировать при нехватке ресурсов с нужными навыками',
                'Уведомлять о перегрузке критических ресурсов',
            ],
        },
        [AgentRole.RISK_ASSESSOR]: {
            role: AgentRole.RISK_ASSESSOR,
            capabilities: [
                {
                    name: 'Risk Identification',
                    description: 'Выявление рисков проекта',
                    applicableColumns: ['all'],
                    taskTypes: ['all'],
                    triggerConditions: [
                        'risk_indicator',
                        'dependency_issue',
                        'timeline_threat',
                    ],
                    specializations: [
                        'dependency_analysis',
                        'timeline_risk',
                        'quality_risk',
                    ],
                    requiredContexts: [
                        'project_timeline',
                        'dependencies',
                        'historical_risks',
                    ],
                },
            ],
            instructions: [
                'Выявляй потенциальные риски на раннем этапе',
                'Анализируй влияние зависимостей на сроки',
                'Предлагай стратегии митигации рисков',
                'Мониторь индикаторы риска',
            ],
            decisionWeights: {
                risk_probability: 0.3,
                impact_severity: 0.3,
                mitigation_feasibility: 0.2,
                timeline_effect: 0.2,
            },
            confidenceThresholds: { low: 30, medium: 60, high: 85 },
            escalationRules: [
                'Немедленно эскалировать высокие риски',
                'Еженедельные отчеты по рискам',
            ],
        },
        [AgentRole.PERFORMANCE_ANALYST]: {
            role: AgentRole.PERFORMANCE_ANALYST,
            capabilities: [
                {
                    name: 'Performance Monitoring',
                    description: 'Мониторинг производительности команды',
                    applicableColumns: ['Done'],
                    taskTypes: ['all'],
                    triggerConditions: [
                        'task_completion',
                        'metric_update',
                        'performance_review',
                    ],
                    specializations: [
                        'velocity_tracking',
                        'cycle_time_analysis',
                        'throughput_measurement',
                    ],
                    requiredContexts: [
                        'historical_metrics',
                        'team_performance',
                        'baseline_data',
                    ],
                },
            ],
            instructions: [
                'Отслеживай ключевые метрики производительности',
                'Анализируй тренды и выявляй аномалии',
                'Предлагай улучшения на основе данных',
                'Сравнивай с историческими показателями',
            ],
            decisionWeights: {
                metric_accuracy: 0.4,
                trend_significance: 0.3,
                actionability: 0.2,
                business_relevance: 0.1,
            },
            confidenceThresholds: { low: 50, medium: 75, high: 95 },
            escalationRules: [
                'Уведомлять о значительных отклонениях метрик',
                'Месячные аналитические отчеты',
            ],
        },
        [AgentRole.UNIVERSAL]: {
            role: AgentRole.UNIVERSAL,
            capabilities: [
                {
                    name: 'General Task Management',
                    description: 'Универсальное управление задачами',
                    applicableColumns: ['all'],
                    taskTypes: ['all'],
                    triggerConditions: ['any'],
                    specializations: ['adaptive_processing', 'multi_domain_expertise'],
                    requiredContexts: ['flexible'],
                },
            ],
            instructions: [
                'Адаптируйся к любым типам задач и ситуаций',
                'Используй все доступные возможности для решения задач',
                'Обучайся на каждом взаимодействии',
                'Применяй лучшие практики из всех ролей',
            ],
            decisionWeights: {
                situation_analysis: 0.3,
                adaptability: 0.3,
                effectiveness: 0.2,
                learning_opportunity: 0.2,
            },
            confidenceThresholds: { low: 20, medium: 50, high: 80 },
            escalationRules: [
                'Эскалировать сложные случаи специализированным агентам',
                'Обучаться на всех взаимодействиях',
            ],
        },
    };
    agentSpecializations = new Map();
    determineOptimalRole(taskType, columnName, triggerType, urgency, complexity) {
        const scores = {};
        Object.values(AgentRole).forEach((role) => {
            scores[role] = 0;
        });
        for (const [role, config] of Object.entries(this.roleConfigurations)) {
            const roleEnum = role;
            for (const capability of config.capabilities) {
                if (capability.applicableColumns.includes('all') ||
                    capability.applicableColumns.includes(columnName)) {
                    scores[roleEnum] += 2;
                }
                if (capability.taskTypes.includes('all') ||
                    capability.taskTypes.includes(taskType)) {
                    scores[roleEnum] += 2;
                }
                for (const trigger of capability.triggerConditions) {
                    if (triggerType.includes(trigger) || trigger === 'any') {
                        scores[roleEnum] += 1;
                    }
                }
            }
            if (urgency === 'critical' && roleEnum === AgentRole.PRIORITY_MANAGER) {
                scores[roleEnum] += 3;
            }
            if (complexity === 'complex' && roleEnum === AgentRole.RISK_ASSESSOR) {
                scores[roleEnum] += 2;
            }
            if (columnName.includes('Test') &&
                roleEnum === AgentRole.QUALITY_CONTROLLER) {
                scores[roleEnum] += 3;
            }
        }
        const optimalRole = Object.entries(scores).reduce((best, [role, score]) => score > best.score ? { role: role, score } : best, { role: AgentRole.UNIVERSAL, score: 0 }).role;
        this.logger.log(`🎭 Determined optimal role: ${optimalRole} for ${taskType} in ${columnName}`);
        return optimalRole;
    }
    getRoleConfiguration(role) {
        return this.roleConfigurations[role];
    }
    configureAgentSpecialization(agentId, primaryRole, secondaryRoles = [], expertiseAreas = []) {
        const specialization = {
            agentId,
            primaryRole,
            secondaryRoles,
            expertiseAreas,
            performanceMetrics: {
                successRate: 0,
                averageConfidence: 0,
                responseTime: 0,
            },
            adaptability: 0.5,
        };
        this.agentSpecializations.set(agentId, specialization);
        this.logger.log(`🎪 Configured specialization for agent ${agentId}: ${primaryRole} + [${secondaryRoles.join(', ')}]`);
        return specialization;
    }
    updateAgentPerformance(agentId, successRate, confidence, responseTime) {
        const specialization = this.agentSpecializations.get(agentId);
        if (specialization) {
            specialization.performanceMetrics.successRate =
                specialization.performanceMetrics.successRate * 0.8 + successRate * 0.2;
            specialization.performanceMetrics.averageConfidence =
                specialization.performanceMetrics.averageConfidence * 0.8 +
                    confidence * 0.2;
            specialization.performanceMetrics.responseTime =
                specialization.performanceMetrics.responseTime * 0.8 +
                    responseTime * 0.2;
            const performanceScore = (successRate + confidence / 100) / 2;
            specialization.adaptability =
                specialization.adaptability * 0.9 + performanceScore * 0.1;
            this.logger.log(`📊 Updated performance for agent ${agentId}: Success: ${successRate.toFixed(2)}, Confidence: ${confidence.toFixed(2)}`);
        }
    }
    adaptAgentRole(agentId) {
        const specialization = this.agentSpecializations.get(agentId);
        if (!specialization) {
            return null;
        }
        const { performanceMetrics, primaryRole, adaptability } = specialization;
        if (performanceMetrics.successRate < 0.6 && adaptability > 0.7) {
            this.logger.log(`🎨 Adapting role for low-performing agent ${agentId}: ${primaryRole} -> ${AgentRole.UNIVERSAL}`);
            return AgentRole.UNIVERSAL;
        }
        if (performanceMetrics.successRate > 0.9 &&
            performanceMetrics.averageConfidence > 80) {
            this.logger.log(`🎨 Agent ${agentId} shows excellent performance in ${primaryRole}`);
        }
        return null;
    }
    getBestRoleForSituation(taskType, columnName, urgency, complexity, availableAgents) {
        const optimalRole = this.determineOptimalRole(taskType, columnName, 'task_processing', urgency, complexity);
        let bestAgentId;
        let bestScore = 0;
        for (const agentId of availableAgents) {
            const specialization = this.agentSpecializations.get(agentId);
            if (specialization) {
                let score = 0;
                if (specialization.primaryRole === optimalRole) {
                    score += 10;
                }
                if (specialization.secondaryRoles.includes(optimalRole)) {
                    score += 5;
                }
                score += specialization.performanceMetrics.successRate * 5;
                score += specialization.performanceMetrics.averageConfidence / 20;
                score += specialization.adaptability * 3;
                if (score > bestScore) {
                    bestScore = score;
                    bestAgentId = agentId;
                }
            }
        }
        return {
            recommendedRole: optimalRole,
            bestAgentId,
        };
    }
    getRoleStatistics() {
        const stats = {};
        Object.values(AgentRole).forEach((role) => {
            stats[role] = {
                agentCount: 0,
                averagePerformance: 0,
                topPerformers: [],
            };
        });
        for (const [agentId, specialization] of this.agentSpecializations) {
            const role = specialization.primaryRole;
            stats[role].agentCount++;
            const performance = specialization.performanceMetrics.successRate;
            stats[role].averagePerformance += performance;
            if (performance > 0.8) {
                stats[role].topPerformers.push(agentId);
            }
        }
        Object.keys(stats).forEach((role) => {
            const roleEnum = role;
            if (stats[roleEnum].agentCount > 0) {
                stats[roleEnum].averagePerformance /= stats[roleEnum].agentCount;
            }
        });
        return stats;
    }
    getAgentSpecialization(agentId) {
        return this.agentSpecializations.get(agentId);
    }
    getAvailableRoles() {
        return Object.values(AgentRole);
    }
    getTeamRoleRecommendations(teamSize, projectType) {
        const recommendations = [];
        const distribution = {};
        const reasoning = [];
        recommendations.push(AgentRole.UNIVERSAL, AgentRole.PRIORITY_MANAGER);
        distribution[AgentRole.UNIVERSAL] = Math.max(1, Math.floor(teamSize * 0.4));
        distribution[AgentRole.PRIORITY_MANAGER] = 1;
        if (teamSize > 2) {
            recommendations.push(AgentRole.QUALITY_CONTROLLER);
            distribution[AgentRole.QUALITY_CONTROLLER] = 1;
            reasoning.push('Контроль качества критичен для команд больше 2 человек');
        }
        if (teamSize > 4) {
            recommendations.push(AgentRole.WORKFLOW_OPTIMIZER);
            distribution[AgentRole.WORKFLOW_OPTIMIZER] = 1;
            reasoning.push('Оптимизация workflow важна для больших команд');
        }
        if (projectType.includes('enterprise') || teamSize > 6) {
            recommendations.push(AgentRole.STAKEHOLDER_COMMUNICATOR, AgentRole.RISK_ASSESSOR);
            distribution[AgentRole.STAKEHOLDER_COMMUNICATOR] = 1;
            distribution[AgentRole.RISK_ASSESSOR] = 1;
            reasoning.push('Enterprise проекты требуют специализированной коммуникации и управления рисками');
        }
        return {
            recommendedRoles: recommendations,
            roleDistribution: distribution,
            reasoning,
        };
    }
};
exports.AgentRoleService = AgentRoleService;
exports.AgentRoleService = AgentRoleService = AgentRoleService_1 = __decorate([
    (0, common_1.Injectable)()
], AgentRoleService);
//# sourceMappingURL=agent-role.service.js.map