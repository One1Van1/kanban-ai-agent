import { FetchExternalContextQueryDto } from './fetch-external-context.query.dto';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';
export declare class FetchExternalContextService {
    execute(taskId: string, query: FetchExternalContextQueryDto): Promise<FetchExternalContextResponseDto>;
    private fetchFromExternalSources;
    private fetchFromSource;
    private generateMockDataForSource;
    private getSourceName;
    private generateTitleForSource;
    private generateContentForSource;
    private generateUrlForSource;
    private generateMetadataForSource;
}
