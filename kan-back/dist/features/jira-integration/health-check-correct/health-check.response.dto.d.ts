export declare class HealthCheckResponseDto {
    status: string;
    jiraUrl: string;
    projectKey: string;
    timestamp: string;
    details?: any;
    constructor(status: string, jiraUrl: string, projectKey: string, details?: any);
}
