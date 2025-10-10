import { JiraTask } from '../../../types/jira-task.interface';
export declare class GetTaskResponseDto implements JiraTask {
    key: string;
    id: string;
    self: string;
    fields: any;
    constructor(task: JiraTask);
}
