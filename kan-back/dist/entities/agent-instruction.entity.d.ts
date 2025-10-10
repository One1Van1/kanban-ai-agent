import { Agent } from './agent.entity';
export declare class AgentInstruction {
    id: string;
    agentId: string;
    columnId: string;
    columnName: string;
    instruction: string;
    triggerEvent: string;
    conditions: Record<string, any>;
    actions: Record<string, any>;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    agent: Agent;
}
