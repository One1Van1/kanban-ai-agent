export interface AppConfig {
    port: number;
    nodeEnv: string;
    webhook: {
        secret?: string;
    };
}
declare const _default: (() => AppConfig) & import("@nestjs/config").ConfigFactoryKeyHost<AppConfig>;
export default _default;
