export declare enum AgentRole {
    WORKFLOW_OPTIMIZER = "workflow_optimizer",
    QUALITY_CONTROLLER = "quality_controller",
    PRIORITY_MANAGER = "priority_manager",
    STAKEHOLDER_COMMUNICATOR = "stakeholder_communicator",
    RESOURCE_ALLOCATOR = "resource_allocator",
    RISK_ASSESSOR = "risk_assessor",
    PERFORMANCE_ANALYST = "performance_analyst",
    UNIVERSAL = "universal"
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
    adaptability: number;
}
export declare class AgentRoleService {
    private readonly logger;
    private readonly roleConfigurations;
    private readonly agentSpecializations;
    determineOptimalRole(taskType: string, columnName: string, triggerType: string, urgency: string, complexity: string): AgentRole;
    getRoleConfiguration(role: AgentRole): RoleConfiguration;
    configureAgentSpecialization(agentId: string, primaryRole: AgentRole, secondaryRoles?: AgentRole[], expertiseAreas?: string[]): AgentSpecialization;
    updateAgentPerformance(agentId: string, successRate: number, confidence: number, responseTime: number): void;
    adaptAgentRole(agentId: string): AgentRole | null;
    getBestRoleForSituation(taskType: string, columnName: string, urgency: string, complexity: string, availableAgents: string[]): {
        recommendedRole: AgentRole;
        bestAgentId?: string;
    };
    getRoleStatistics(): Record<AgentRole, {
        agentCount: number;
        averagePerformance: number;
        topPerformers: string[];
    }>;
    getAgentSpecialization(agentId: string): AgentSpecialization | undefined;
    getAvailableRoles(): AgentRole[];
    getTeamRoleRecommendations(teamSize: number, projectType: string): {
        recommendedRoles: AgentRole[];
        roleDistribution: Record<AgentRole, number>;
        reasoning: string[];
    };
}
