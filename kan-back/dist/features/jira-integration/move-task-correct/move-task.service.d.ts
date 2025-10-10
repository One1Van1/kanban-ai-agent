import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { MoveTaskRequestDto } from './move-task.request.dto';
import { MoveTaskResponseDto } from './move-task.response.dto';
export declare class MoveTaskService extends JiraBaseService {
    execute(taskKey: string, requestDto: MoveTaskRequestDto): Promise<MoveTaskResponseDto>;
}
