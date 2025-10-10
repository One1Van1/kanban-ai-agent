import { Agent } from './agent.entity';
export declare class TaskHistory {
    id: string;
    agentId: string;
    taskId: string;
    taskKey: string;
    taskTitle: string;
    action: string;
    fromStatus?: string;
    toStatus?: string;
    fromColumn?: string;
    toColumn?: string;
    context: Record<string, any>;
    agentResponse: Record<string, any>;
    executedInstruction?: string;
    status: string;
    error?: string;
    processingTimeMs?: number;
    createdAt: Date;
    agent: Agent;
}
