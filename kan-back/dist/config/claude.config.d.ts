export interface ClaudeConfig {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
}
declare const _default: (() => ClaudeConfig) & import("@nestjs/config").ConfigFactoryKeyHost<ClaudeConfig>;
export default _default;
