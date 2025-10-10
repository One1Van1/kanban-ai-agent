declare const _default: (() => {
    defaultModel: string;
    maxTokens: number;
    temperature: number;
    defaultInstructions: string;
    maxRetries: number;
    timeoutMs: number;
    maxContextLength: number;
    enableTracking: boolean;
    trackingRetentionDays: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    defaultModel: string;
    maxTokens: number;
    temperature: number;
    defaultInstructions: string;
    maxRetries: number;
    timeoutMs: number;
    maxContextLength: number;
    enableTracking: boolean;
    trackingRetentionDays: number;
}>;
export default _default;
