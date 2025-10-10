declare const _default: (() => {
    store: string;
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    ttl: number;
    max: number;
    contextTtl: number;
    agentConfigTtl: number;
    taskHistoryTtl: number;
    prefixes: {
        context: string;
        agentConfig: string;
        taskHistory: string;
        queue: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    store: string;
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    ttl: number;
    max: number;
    contextTtl: number;
    agentConfigTtl: number;
    taskHistoryTtl: number;
    prefixes: {
        context: string;
        agentConfig: string;
        taskHistory: string;
        queue: string;
    };
}>;
export default _default;
