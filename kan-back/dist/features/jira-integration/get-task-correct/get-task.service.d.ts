import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetTaskResponseDto } from './get-task.response.dto';
export declare class GetTaskService extends JiraBaseService {
    execute(taskKey: string): Promise<GetTaskResponseDto>;
}
