import { RelationshipType, FetchRelatedTasksQueryDto } from './fetch-related-tasks.query.dto';
export declare class RelatedTaskDto {
    id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    relationshipType: RelationshipType;
    createdAt: string;
    updatedAt: string;
}
export declare class RelatedTasksStatsDto {
    totalFound: number;
    returned: number;
    relationshipTypeDistribution: Record<string, number>;
}
export declare class FetchRelatedTasksResponseDto {
    success: boolean;
    taskId: string;
    relatedTasks: RelatedTaskDto[];
    searchParams: FetchRelatedTasksQueryDto;
    stats: RelatedTasksStatsDto;
    message: string;
    timestamp: string;
    constructor(success: boolean, taskId: string, relatedTasks: RelatedTaskDto[], searchParams: FetchRelatedTasksQueryDto, message: string);
    private calculateDistribution;
}
