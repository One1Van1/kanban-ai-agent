import { JiraTask } from '../../../types/jira-task.interface';
export declare class GetColumnTasksResponseDto {
    tasks: JiraTask[];
    columnStatus: string;
    total: number;
    constructor(tasks: JiraTask[], columnStatus: string, total: number);
}
