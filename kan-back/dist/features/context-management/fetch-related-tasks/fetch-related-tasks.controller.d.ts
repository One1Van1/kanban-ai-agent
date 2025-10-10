import { FetchRelatedTasksService } from './fetch-related-tasks.service';
import { FetchRelatedTasksQueryDto } from './fetch-related-tasks.query.dto';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';
export declare class FetchRelatedTasksController {
    private readonly service;
    constructor(service: FetchRelatedTasksService);
    handle(taskId: string, query: FetchRelatedTasksQueryDto): Promise<FetchRelatedTasksResponseDto>;
}
