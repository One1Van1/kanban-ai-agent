import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { SearchTasksRequestDto } from './search-tasks.request.dto';
import { SearchTasksResponseDto } from './search-tasks.response.dto';
export declare class SearchTasksService extends JiraBaseService {
    execute(requestDto: SearchTasksRequestDto): Promise<SearchTasksResponseDto>;
}
