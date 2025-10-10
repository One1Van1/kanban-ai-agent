import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { AddTaskCommentResponse } from './add-task-comment.interface';
export declare class AddTaskCommentService extends JiraBaseService {
    addCommentToTask(taskKey: string, comment: string): Promise<AddTaskCommentResponse>;
}
