export declare enum ExternalSourceType {
    CONFLUENCE = "confluence",
    SLACK = "slack",
    GITHUB = "github",
    DOCUMENTATION = "documentation",
    KNOWLEDGE_BASE = "knowledge_base",
    PREVIOUS_TICKETS = "previous_tickets",
    CODE_REPOSITORY = "code_repository",
    API_DOCUMENTATION = "api_documentation"
}
export declare class FetchExternalContextQueryDto {
    sources?: ExternalSourceType[];
    keywords?: string[];
    searchDepthDays?: number;
    includeRelatedProjects?: boolean;
    maxResultsPerSource?: number;
}
