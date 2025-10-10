"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraTimeLogger = void 0;
const axios_1 = require("axios");
class JiraTimeLogger {
    jiraConfig;
    constructor(jiraConfig) {
        this.jiraConfig = jiraConfig;
    }
    async logWorkTime(issueKey, timeSpentMinutes, comment) {
        try {
            const timeSpentSeconds = timeSpentMinutes * 60;
            const response = await axios_1.default.post(`${this.jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}/worklog`, {
                timeSpentSeconds: timeSpentSeconds,
                started: new Date().toISOString(),
                comment: `🤖 AI Agent: ${comment}`,
            }, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${this.jiraConfig.email}:${this.jiraConfig.apiToken}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`✅ Time logged for ${issueKey}: ${timeSpentMinutes}m`);
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to log time for ${issueKey}:`, error);
            return false;
        }
    }
    async updateWorklog(issueKey, worklogId, newTimeMinutes) {
        try {
            await axios_1.default.put(`${this.jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}/worklog/${worklogId}`, {
                timeSpentSeconds: newTimeMinutes * 60,
                comment: '🔄 AI Agent: Время скорректировано после анализа',
            }, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${this.jiraConfig.email}:${this.jiraConfig.apiToken}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to update worklog:`, error);
            return false;
        }
    }
}
exports.JiraTimeLogger = JiraTimeLogger;
//# sourceMappingURL=jira-time-logger.service.js.map