interface JiraWorkflowConfig {
    baseUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
}
export declare class JiraWorkflowConfigurator {
    private config;
    constructor(config: JiraWorkflowConfig);
    createTimeLoggingScreen(): Promise<string>;
    configureTransition(workflowName: string, transitionId: string, screenId: string): Promise<void>;
    private addScreenToTransition;
    private addLogWorkPostFunction;
    private addTimeValidators;
    publishWorkflow(workflowName: string): Promise<void>;
    private makeJiraRequest;
}
declare function setupHaircutWorkflow(): Promise<void>;
export { setupHaircutWorkflow };
