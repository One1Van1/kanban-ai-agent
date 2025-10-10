export declare class JiraTimeLogger {
    private readonly jiraConfig;
    constructor(jiraConfig: any);
    logWorkTime(issueKey: string, timeSpentMinutes: number, comment: string): Promise<boolean>;
    updateWorklog(issueKey: string, worklogId: string, newTimeMinutes: number): Promise<boolean>;
}
