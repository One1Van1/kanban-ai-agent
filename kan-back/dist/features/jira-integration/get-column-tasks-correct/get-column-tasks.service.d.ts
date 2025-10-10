import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetColumnTasksRequestDto } from './get-column-tasks.request.dto';
import { GetColumnTasksResponseDto } from './get-column-tasks.response.dto';
export declare class GetColumnTasksService extends JiraBaseService {
    execute(requestDto: GetColumnTasksRequestDto): Promise<GetColumnTasksResponseDto>;
}
