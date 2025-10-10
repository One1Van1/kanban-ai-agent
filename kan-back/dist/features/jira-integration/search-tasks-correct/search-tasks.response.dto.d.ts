import { JiraTask } from '../../../types/jira-task.interface';
export declare class SearchTasksResponseDto {
    issues: JiraTask[];
    total: number;
    startAt: number;
    maxResults: number;
    constructor(issues: JiraTask[], total: number, startAt: number, maxResults: number);
}
