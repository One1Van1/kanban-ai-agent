"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraWorkflowConfigurator = void 0;
exports.setupHaircutWorkflow = setupHaircutWorkflow;
const axios_1 = require("axios");
class JiraWorkflowConfigurator {
    config;
    constructor(config) {
        this.config = config;
    }
    async createTimeLoggingScreen() {
        const screenData = {
            name: 'Haircut Time Logging Screen',
            description: 'Screen for logging haircut work time',
            tabs: [
                {
                    name: 'Log Work',
                    fields: [
                        'timetracking',
                        'comment',
                        'worklog',
                    ],
                },
            ],
        };
        const response = await this.makeJiraRequest('POST', '/rest/api/3/screens', screenData);
        console.log(`✅ Created screen: ${response.data.id}`);
        return response.data.id;
    }
    async configureTransition(workflowName, transitionId, screenId) {
        await this.addScreenToTransition(workflowName, transitionId, screenId);
        await this.addLogWorkPostFunction(workflowName, transitionId);
        await this.addTimeValidators(workflowName, transitionId);
    }
    async addScreenToTransition(workflowName, transitionId, screenId) {
        const transitionData = {
            screen: {
                id: screenId,
            },
        };
        await this.makeJiraRequest('PUT', `/rest/api/3/workflow/transitions/${workflowName}/${transitionId}`, transitionData);
        console.log(`✅ Added screen to transition ${transitionId}`);
    }
    async addLogWorkPostFunction(workflowName, transitionId) {
        const postFunctionData = {
            type: 'com.atlassian.jira.workflow.function.issue.UpdateIssueFunction',
            configuration: {
                logWork: {
                    enabled: true,
                    timeSpentField: 'timetracking',
                    commentField: 'comment',
                    dateField: 'started',
                },
            },
        };
        await this.makeJiraRequest('POST', `/rest/api/3/workflow/${workflowName}/transitions/${transitionId}/postfunctions`, postFunctionData);
        console.log(`✅ Added log work post function to transition ${transitionId}`);
    }
    async addTimeValidators(workflowName, transitionId) {
        const validators = [
            {
                type: 'com.atlassian.jira.workflow.validator.FieldRequiredValidator',
                configuration: {
                    fieldId: 'timetracking',
                    errorMessage: 'Время выполнения обязательно для заполнения',
                },
            },
            {
                type: 'com.atlassian.jira.workflow.validator.FieldRequiredValidator',
                configuration: {
                    fieldId: 'comment',
                    errorMessage: 'Описание работы обязательно для заполнения',
                },
            },
        ];
        for (const validator of validators) {
            await this.makeJiraRequest('POST', `/rest/api/3/workflow/${workflowName}/transitions/${transitionId}/validators`, validator);
        }
        console.log(`✅ Added validators to transition ${transitionId}`);
    }
    async publishWorkflow(workflowName) {
        await this.makeJiraRequest('POST', `/rest/api/3/workflow/${workflowName}/publish`, {});
        console.log(`✅ Published workflow: ${workflowName}`);
    }
    async makeJiraRequest(method, endpoint, data) {
        const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');
        return await (0, axios_1.default)({
            method,
            url: `${this.config.baseUrl}${endpoint}`,
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            data,
        });
    }
}
exports.JiraWorkflowConfigurator = JiraWorkflowConfigurator;
async function setupHaircutWorkflow() {
    const configurator = new JiraWorkflowConfigurator({
        baseUrl: 'https://your-domain.atlassian.net',
        email: 'admin@company.com',
        apiToken: 'your-api-token',
        projectKey: 'HAIR',
    });
    try {
        const screenId = await configurator.createTimeLoggingScreen();
        await configurator.configureTransition('Haircut Workflow', 'In Progress_Review', screenId);
        await configurator.publishWorkflow('Haircut Workflow');
        console.log('🎉 Workflow configured successfully!');
    }
    catch (error) {
        console.error('❌ Failed to configure workflow:', error);
    }
}
//# sourceMappingURL=workflow-configurator.service.js.map