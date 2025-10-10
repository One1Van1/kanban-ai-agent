export declare class TimeValidationWebhookResponseDto {
    status: string;
    issueKey: string;
    isValid: boolean;
    processedAt: string;
    validationDetails: any;
    constructor(status: string, issueKey: string, isValid: boolean, validationDetails: any);
}
