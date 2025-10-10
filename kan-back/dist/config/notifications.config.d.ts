declare const _default: (() => {
    email: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string | undefined;
            pass: string | undefined;
        };
        from: string;
    };
    telegram: {
        botToken: string | undefined;
        defaultChatId: string | undefined;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    email: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string | undefined;
            pass: string | undefined;
        };
        from: string;
    };
    telegram: {
        botToken: string | undefined;
        defaultChatId: string | undefined;
    };
}>;
export default _default;
