export declare class JiraWebhookHandlerResponseDto {
    status: string;
    issueKey: string;
    eventType: string;
    processedAt: string;
    details?: any;
    constructor(status: string, issueKey: string, eventType: string, details?: any);
}
