import { Injectable, Logger } from '@nestjs/common';

export enum AgentRole {
  WORKFLOW_OPTIMIZER = 'workflow_optimizer',
  QUALITY_CONTROLLER = 'quality_controller',
  PRIORITY_MANAGER = 'priority_manager',
  STAKEHOLDER_COMMUNICATOR = 'stakeholder_communicator',
  RESOURCE_ALLOCATOR = 'resource_allocator',
  RISK_ASSESSOR = 'risk_assessor',
  PERFORMANCE_ANALYST = 'performance_analyst',
  UNIVERSAL = 'universal',
}

export interface RoleCapability {
  name: string;
  description: string;
  applicableColumns: string[];
  taskTypes: string[];
  triggerConditions: string[];
  specializations: string[];
  requiredContexts: string[];
}

export interface RoleConfiguration {
  role: AgentRole;
  capabilities: RoleCapability[];
  instructions: string[];
  decisionWeights: Record<string, number>;
  confidenceThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  escalationRules: string[];
}

export interface AgentSpecialization {
  agentId: string;
  primaryRole: AgentRole;
  secondaryRoles: AgentRole[];
  expertiseAreas: string[];
  performanceMetrics: {
    successRate: number;
    averageConfidence: number;
    responseTime: number;
  };
  adaptability: number; // 0-1, насколько хорошо агент адаптируется к новым ситуациям
}

@Injectable()
export class AgentRoleService {
  private readonly logger = new Logger(AgentRoleService.name);

  private readonly roleConfigurations: Record<AgentRole, RoleConfiguration> = {
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

  private readonly agentSpecializations: Map<string, AgentSpecialization> =
    new Map();

  /**
   * 🎭 Определить оптимальную роль для агента на основе контекста
   */
  determineOptimalRole(
    taskType: string,
    columnName: string,
    triggerType: string,
    urgency: string,
    complexity: string,
  ): AgentRole {
    const scores: Record<AgentRole, number> = {} as Record<AgentRole, number>;

    // Инициализируем счетчики
    Object.values(AgentRole).forEach((role) => {
      scores[role] = 0;
    });

    // Оцениваем каждую роль
    for (const [role, config] of Object.entries(this.roleConfigurations)) {
      const roleEnum = role as AgentRole;

      for (const capability of config.capabilities) {
        // Проверяем применимость к колонке
        if (
          capability.applicableColumns.includes('all') ||
          capability.applicableColumns.includes(columnName)
        ) {
          scores[roleEnum] += 2;
        }

        // Проверяем применимость к типу задачи
        if (
          capability.taskTypes.includes('all') ||
          capability.taskTypes.includes(taskType)
        ) {
          scores[roleEnum] += 2;
        }

        // Проверяем триггеры
        for (const trigger of capability.triggerConditions) {
          if (triggerType.includes(trigger) || trigger === 'any') {
            scores[roleEnum] += 1;
          }
        }
      }

      // Дополнительные бонусы по контексту
      if (urgency === 'critical' && roleEnum === AgentRole.PRIORITY_MANAGER) {
        scores[roleEnum] += 3;
      }

      if (complexity === 'complex' && roleEnum === AgentRole.RISK_ASSESSOR) {
        scores[roleEnum] += 2;
      }

      if (
        columnName.includes('Test') &&
        roleEnum === AgentRole.QUALITY_CONTROLLER
      ) {
        scores[roleEnum] += 3;
      }
    }

    // Находим роль с максимальным счетом
    const optimalRole = Object.entries(scores).reduce(
      (best, [role, score]) =>
        score > best.score ? { role: role as AgentRole, score } : best,
      { role: AgentRole.UNIVERSAL, score: 0 },
    ).role;

    this.logger.log(
      `🎭 Determined optimal role: ${optimalRole} for ${taskType} in ${columnName}`,
    );

    return optimalRole;
  }

  /**
   * 🎯 Получить конфигурацию роли
   */
  getRoleConfiguration(role: AgentRole): RoleConfiguration {
    return this.roleConfigurations[role];
  }

  /**
   * 🎪 Настроить специализацию агента
   */
  configureAgentSpecialization(
    agentId: string,
    primaryRole: AgentRole,
    secondaryRoles: AgentRole[] = [],
    expertiseAreas: string[] = [],
  ): AgentSpecialization {
    const specialization: AgentSpecialization = {
      agentId,
      primaryRole,
      secondaryRoles,
      expertiseAreas,
      performanceMetrics: {
        successRate: 0,
        averageConfidence: 0,
        responseTime: 0,
      },
      adaptability: 0.5, // Начальное значение
    };

    this.agentSpecializations.set(agentId, specialization);

    this.logger.log(
      `🎪 Configured specialization for agent ${agentId}: ${primaryRole} + [${secondaryRoles.join(', ')}]`,
    );

    return specialization;
  }

  /**
   * 📊 Обновить метрики производительности агента
   */
  updateAgentPerformance(
    agentId: string,
    successRate: number,
    confidence: number,
    responseTime: number,
  ): void {
    const specialization = this.agentSpecializations.get(agentId);

    if (specialization) {
      // Обновляем метрики с плавным усреднением
      specialization.performanceMetrics.successRate =
        specialization.performanceMetrics.successRate * 0.8 + successRate * 0.2;

      specialization.performanceMetrics.averageConfidence =
        specialization.performanceMetrics.averageConfidence * 0.8 +
        confidence * 0.2;

      specialization.performanceMetrics.responseTime =
        specialization.performanceMetrics.responseTime * 0.8 +
        responseTime * 0.2;

      // Обновляем адаптивность на основе производительности
      const performanceScore = (successRate + confidence / 100) / 2;
      specialization.adaptability =
        specialization.adaptability * 0.9 + performanceScore * 0.1;

      this.logger.log(
        `📊 Updated performance for agent ${agentId}: Success: ${successRate.toFixed(2)}, Confidence: ${confidence.toFixed(2)}`,
      );
    }
  }

  /**
   * 🎨 Адаптировать роль агента на основе производительности
   */
  adaptAgentRole(agentId: string): AgentRole | null {
    const specialization = this.agentSpecializations.get(agentId);

    if (!specialization) {
      return null;
    }

    const { performanceMetrics, primaryRole, adaptability } = specialization;

    // Если агент показывает низкую производительность, возможно нужна смена роли
    if (performanceMetrics.successRate < 0.6 && adaptability > 0.7) {
      // Логика выбора новой роли на основе анализа неудач
      // Пока возвращаем Universal как fallback
      this.logger.log(
        `🎨 Adapting role for low-performing agent ${agentId}: ${primaryRole} -> ${AgentRole.UNIVERSAL}`,
      );
      return AgentRole.UNIVERSAL;
    }

    // Если агент показывает отличную производительность, может стать более специализированным
    if (
      performanceMetrics.successRate > 0.9 &&
      performanceMetrics.averageConfidence > 80
    ) {
      // Логика углубления специализации
      this.logger.log(
        `🎨 Agent ${agentId} shows excellent performance in ${primaryRole}`,
      );
    }

    return null; // Изменения не требуются
  }

  /**
   * 🏆 Получить лучшую роль для конкретной ситуации
   */
  getBestRoleForSituation(
    taskType: string,
    columnName: string,
    urgency: string,
    complexity: string,
    availableAgents: string[],
  ): { recommendedRole: AgentRole; bestAgentId?: string } {
    const optimalRole = this.determineOptimalRole(
      taskType,
      columnName,
      'task_processing',
      urgency,
      complexity,
    );

    // Находим лучшего агента для этой роли среди доступных
    let bestAgentId: string | undefined;
    let bestScore = 0;

    for (const agentId of availableAgents) {
      const specialization = this.agentSpecializations.get(agentId);

      if (specialization) {
        let score = 0;

        // Основная роль совпадает
        if (specialization.primaryRole === optimalRole) {
          score += 10;
        }

        // Вторичная роль совпадает
        if (specialization.secondaryRoles.includes(optimalRole)) {
          score += 5;
        }

        // Добавляем метрики производительности
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

  /**
   * 📈 Получить статистику по ролям
   */
  getRoleStatistics(): Record<
    AgentRole,
    {
      agentCount: number;
      averagePerformance: number;
      topPerformers: string[];
    }
  > {
    const stats: Record<AgentRole, any> = {} as Record<AgentRole, any>;

    // Инициализируем статистику
    Object.values(AgentRole).forEach((role) => {
      stats[role] = {
        agentCount: 0,
        averagePerformance: 0,
        topPerformers: [],
      };
    });

    // Собираем статистику
    for (const [agentId, specialization] of this.agentSpecializations) {
      const role = specialization.primaryRole;
      stats[role].agentCount++;

      const performance = specialization.performanceMetrics.successRate;
      stats[role].averagePerformance += performance;

      if (performance > 0.8) {
        stats[role].topPerformers.push(agentId);
      }
    }

    // Усредняем производительность
    Object.keys(stats).forEach((role) => {
      const roleEnum = role as AgentRole;
      if (stats[roleEnum].agentCount > 0) {
        stats[roleEnum].averagePerformance /= stats[roleEnum].agentCount;
      }
    });

    return stats;
  }

  /**
   * 🎯 Получить специализацию агента
   */
  getAgentSpecialization(agentId: string): AgentSpecialization | undefined {
    return this.agentSpecializations.get(agentId);
  }

  /**
   * 📋 Получить все доступные роли
   */
  getAvailableRoles(): AgentRole[] {
    return Object.values(AgentRole);
  }

  /**
   * 🎪 Получить рекомендации по ролям для команды
   */
  getTeamRoleRecommendations(
    teamSize: number,
    projectType: string,
  ): {
    recommendedRoles: AgentRole[];
    roleDistribution: Record<AgentRole, number>;
    reasoning: string[];
  } {
    const recommendations: AgentRole[] = [];
    const distribution: Record<AgentRole, number> = {} as Record<
      AgentRole,
      number
    >;
    const reasoning: string[] = [];

    // Базовые роли для любой команды
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
      recommendations.push(
        AgentRole.STAKEHOLDER_COMMUNICATOR,
        AgentRole.RISK_ASSESSOR,
      );
      distribution[AgentRole.STAKEHOLDER_COMMUNICATOR] = 1;
      distribution[AgentRole.RISK_ASSESSOR] = 1;
      reasoning.push(
        'Enterprise проекты требуют специализированной коммуникации и управления рисками',
      );
    }

    return {
      recommendedRoles: recommendations,
      roleDistribution: distribution,
      reasoning,
    };
  }
}
