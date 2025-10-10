import { JiraTaskTransition } from '../../../types/jira-task.interface';
export declare class GetTaskTransitionsResponseDto {
    taskKey: string;
    transitions: JiraTaskTransition[];
    total: number;
    constructor(taskKey: string, transitions: JiraTaskTransition[]);
}
