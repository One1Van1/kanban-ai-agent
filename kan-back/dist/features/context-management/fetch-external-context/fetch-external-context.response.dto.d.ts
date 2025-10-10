import { ExternalSourceType, FetchExternalContextQueryDto } from './fetch-external-context.query.dto';
export declare class ExternalContextItemDto {
    id: string;
    title: string;
    content: string;
    url: string;
    author: string;
    createdAt: string;
    relevanceScore: number;
    metadata: Record<string, any>;
}
export declare class ExternalSourceContextDto {
    sourceType: ExternalSourceType;
    sourceName: string;
    isAvailable: boolean;
    lastUpdated: string;
    items: ExternalContextItemDto[];
    totalFound: number;
    searchQuery: string;
}
export declare class ExternalContextStatsDto {
    sourcesQueried: number;
    sourcesAvailable: number;
    totalItemsFound: number;
    averageRelevance: number;
    executionTimeMs: number;
    itemsPerSource: Record<string, number>;
}
export declare class FetchExternalContextResponseDto {
    success: boolean;
    taskId: string;
    externalContexts: ExternalSourceContextDto[];
    searchParams: FetchExternalContextQueryDto;
    stats: ExternalContextStatsDto;
    message: string;
    timestamp: string;
    constructor(success: boolean, taskId: string, externalContexts: ExternalSourceContextDto[], searchParams: FetchExternalContextQueryDto, message: string);
    private calculateStats;
}
