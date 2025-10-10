import { AgentRoleService, AgentRole } from './agent-role.service';
declare class ConfigureAgentRoleRequestDto {
    primaryRole: AgentRole;
    secondaryRoles?: AgentRole[];
    expertiseAreas?: string[];
}
declare class GetOptimalRoleRequestDto {
    taskType: string;
    columnName: string;
    urgency: string;
    complexity: string;
}
declare class GetTeamRecommendationsRequestDto {
    teamSize: number;
    projectType: string;
}
export declare class AgentRoleController {
    private readonly roleService;
    private readonly logger;
    constructor(roleService: AgentRoleService);
    getAvailableRoles(): {
        roles: AgentRole[];
    };
    configureAgentRole(agentId: string, request: ConfigureAgentRoleRequestDto): {
        success: boolean;
        specialization: any;
    };
    getAgentSpecialization(agentId: string): {
        specialization: any;
    };
    determineOptimalRole(request: GetOptimalRoleRequestDto): {
        optimalRole: AgentRole;
        reasoning: string;
    };
    getRoleConfiguration(role: AgentRole): {
        configuration: any;
    };
    getRoleStatistics(): {
        statistics: Record<AgentRole, any>;
    };
    getTeamRoleRecommendations(request: GetTeamRecommendationsRequestDto): {
        recommendedRoles: AgentRole[];
        roleDistribution: Record<AgentRole, number>;
        reasoning: string[];
    };
    adaptAgentRole(agentId: string): {
        currentRole: AgentRole | null;
        suggestedRole: AgentRole | null;
        shouldAdapt: boolean;
        reasoning: string;
    };
}
export {};
