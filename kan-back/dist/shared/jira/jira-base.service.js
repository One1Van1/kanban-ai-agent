"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JiraBaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraBaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let JiraBaseService = JiraBaseService_1 = class JiraBaseService {
    configService;
    logger = new common_1.Logger(JiraBaseService_1.name);
    httpClient;
    config;
    constructor(configService) {
        this.configService = configService;
        this.config = {
            baseUrl: this.configService.get('jira.baseUrl') || '',
            username: this.configService.get('jira.email') || '',
            apiToken: this.configService.get('jira.apiToken') || '',
            projectKey: this.configService.get('jira.projectKey') || '',
            boardId: this.configService.get('jira.boardId'),
        };
        this.validateConfig();
        this.httpClient = this.createHttpClient();
    }
    validateConfig() {
        const { baseUrl, username, apiToken, projectKey } = this.config;
        if (!baseUrl || !username || !apiToken || !projectKey) {
            throw new Error('Jira configuration is incomplete. Please check JIRA_BASE_URL, JIRA_USERNAME, JIRA_API_TOKEN, and JIRA_PROJECT_KEY environment variables.');
        }
        this.logger.log(`Jira service initialized for project: ${projectKey}`);
    }
    createHttpClient() {
        const client = axios_1.default.create({
            baseURL: `${this.config.baseUrl}/rest/api/3`,
            timeout: 30000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            auth: {
                username: this.config.username,
                password: this.config.apiToken,
            },
        });
        client.interceptors.request.use((config) => {
            this.logger.debug(`Jira API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        });
        client.interceptors.response.use((response) => {
            this.logger.debug(`Jira API Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            const message = error.response?.data?.errorMessages?.[0] || error.message;
            this.logger.error(`Jira API Error: ${error.response?.status} - ${message}`);
            throw new Error(`Jira API Error: ${message}`);
        });
        return client;
    }
    async testConnection() {
        try {
            await this.httpClient.get('/myself');
            this.logger.log('Jira connection test successful');
            return true;
        }
        catch (error) {
            this.logger.error(`Jira connection test failed: ${error.message}`);
            return false;
        }
    }
    async getTask(taskKey) {
        try {
            const response = await this.httpClient.get(`/issue/${taskKey}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get task ${taskKey}: ${error.message}`);
            throw error;
        }
    }
    async searchTasks(jql, startAt = 0, maxResults = 50) {
        try {
            const response = await this.httpClient.post('/search', {
                jql,
                startAt,
                maxResults,
                fields: [
                    'summary',
                    'description',
                    'status',
                    'assignee',
                    'priority',
                    'issuetype',
                    'created',
                    'updated',
                    'duedate',
                    'labels',
                    'comment',
                ],
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to search tasks: ${error.message}`);
            throw error;
        }
    }
    async getTaskTransitions(taskKey) {
        try {
            const response = await this.httpClient.get(`/issue/${taskKey}/transitions`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get transitions for task ${taskKey}: ${error.message}`);
            throw error;
        }
    }
    async transitionTask(taskKey, transitionId) {
        try {
            await this.httpClient.post(`/issue/${taskKey}/transitions`, {
                transition: { id: transitionId },
            });
            this.logger.log(`Task ${taskKey} transitioned using transition ${transitionId}`);
        }
        catch (error) {
            this.logger.error(`Failed to transition task ${taskKey}: ${error.message}`);
            throw error;
        }
    }
    async addComment(taskKey, comment) {
        try {
            await this.httpClient.post(`/issue/${taskKey}/comment`, comment);
            this.logger.log(`Comment added to task ${taskKey}`);
        }
        catch (error) {
            this.logger.error(`Failed to add comment to task ${taskKey}: ${error.message}`);
            throw error;
        }
    }
    getHttpClient() {
        return this.httpClient;
    }
    getConfig() {
        return this.config;
    }
};
exports.JiraBaseService = JiraBaseService;
exports.JiraBaseService = JiraBaseService = JiraBaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JiraBaseService);
//# sourceMappingURL=jira-base.service.js.map