import { AgentInstruction } from './agent-instruction.entity';
import { TaskHistory } from './task-history.entity';
export declare class Agent {
    id: string;
    name: string;
    description?: string;
    status: string;
    config: Record<string, any>;
    jiraInstanceUrl?: string;
    jiraProjectKey?: string;
    jiraApiToken?: string;
    contextSources: Record<string, any>;
    notificationSettings: Record<string, any>;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    instructions: AgentInstruction[];
    taskHistories: TaskHistory[];
}
