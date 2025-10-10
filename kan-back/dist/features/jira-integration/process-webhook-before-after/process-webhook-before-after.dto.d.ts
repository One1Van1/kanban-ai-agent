export declare class JiraIssueFieldsDto {
    summary: string;
    description?: string;
    status: {
        name: string;
        id: string;
    };
    assignee?: {
        displayName: string;
        accountId: string;
    };
    attachment?: any[];
}
export declare class JiraIssueDto {
    key: string;
    id: string;
    fields: JiraIssueFieldsDto;
}
export declare class ProcessWebhookBeforeAfterDto {
    webhookEvent: string;
    timestamp?: number;
    issue: JiraIssueDto;
    changelog?: any;
    issue_event_type_name?: string;
    user?: {
        self?: string;
        accountId?: string;
        avatarUrls?: any;
        displayName?: string;
        active?: boolean;
    };
}
export declare class ClaudeAnalysisDto {
    transformation: {
        category: string;
        difficultyLevel: number;
        visualChanges: string[];
        technique: string;
    };
    quality: {
        overallScore: number;
        evenness: number;
        transitions: number;
        symmetry: number;
        cleanliness: number;
        styleCompliance: number;
    };
    recommendations: string[];
}
export declare class ProcessWebhookBeforeAfterResponseDto {
    success: boolean;
    message: string;
    processed: boolean;
    taskKey?: string;
    analysis?: ClaudeAnalysisDto;
    error?: string;
    timestamp: string;
}
