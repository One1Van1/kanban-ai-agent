export interface JiraConfig {
    baseUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
    statusMapping: {
        new: string;
        questions: string;
        inProgress: string;
        review: string;
        done: string;
    };
}
declare const _default: (() => JiraConfig) & import("@nestjs/config").ConfigFactoryKeyHost<JiraConfig>;
export default _default;
