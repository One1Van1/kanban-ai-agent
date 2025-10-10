import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetTaskTransitionsRequestDto } from './get-task-transitions.request.dto';
import { GetTaskTransitionsResponseDto } from './get-task-transitions.response.dto';
export declare class GetTaskTransitionsService extends JiraBaseService {
    execute(requestDto: GetTaskTransitionsRequestDto): Promise<GetTaskTransitionsResponseDto>;
}
