import { FetchRelatedTasksQueryDto } from './fetch-related-tasks.query.dto';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';
export declare class FetchRelatedTasksService {
    execute(taskId: string, query: FetchRelatedTasksQueryDto): Promise<FetchRelatedTasksResponseDto>;
    private generateMockRelatedTasks;
    private getRelationshipType;
}
