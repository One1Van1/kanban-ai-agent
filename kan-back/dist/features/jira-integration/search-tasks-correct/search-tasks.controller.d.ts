import { SearchTasksService } from './search-tasks.service';
import { SearchTasksRequestDto } from './search-tasks.request.dto';
import { SearchTasksResponseDto } from './search-tasks.response.dto';
export declare class SearchTasksController {
    private readonly service;
    constructor(service: SearchTasksService);
    handle(requestDto: SearchTasksRequestDto): Promise<SearchTasksResponseDto>;
}
