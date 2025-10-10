declare const _default: (() => {
    redis: {
        host: string;
        port: number;
        password: string | undefined;
        username: string | undefined;
        db: number;
    };
    defaultJobOptions: {
        removeOnComplete: number;
        removeOnFail: number;
        attempts: number;
        delay: number;
        backoff: {
            type: string;
            delay: number;
        };
    };
    concurrency: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    redis: {
        host: string;
        port: number;
        password: string | undefined;
        username: string | undefined;
        db: number;
    };
    defaultJobOptions: {
        removeOnComplete: number;
        removeOnFail: number;
        attempts: number;
        delay: number;
        backoff: {
            type: string;
            delay: number;
        };
    };
    concurrency: number;
}>;
export default _default;
