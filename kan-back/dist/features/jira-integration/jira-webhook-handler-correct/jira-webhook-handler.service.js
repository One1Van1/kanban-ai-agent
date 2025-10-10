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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraWebhookHandlerService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const jira_webhook_handler_response_dto_1 = require("./jira-webhook-handler.response.dto");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const agent_entity_1 = require("../../../entities/agent.entity");
const agent_instruction_entity_1 = require("../../../entities/agent-instruction.entity");
let JiraWebhookHandlerService = class JiraWebhookHandlerService extends jira_base_service_1.JiraBaseService {
    agentRepository;
    agentInstructionRepository;
    constructor(configService, agentRepository, agentInstructionRepository) {
        super(configService);
        this.agentRepository = agentRepository;
        this.agentInstructionRepository = agentInstructionRepository;
    }
    async execute(requestDto) {
        try {
            this.logger.log(`Processing webhook event: ${requestDto.webhookEvent}`);
            const issueKey = requestDto.issue?.key || 'unknown';
            const eventType = this.extractEventType(requestDto.webhookEvent);
            let details = {};
            switch (eventType) {
                case 'issue_created':
                    details = await this.handleIssueCreated(requestDto);
                    break;
                case 'issue_updated':
                    details = await this.handleIssueUpdated(requestDto);
                    break;
                case 'issue_deleted':
                    details = await this.handleIssueDeleted(requestDto);
                    break;
                default:
                    details = { message: `Unhandled event type: ${eventType}` };
            }
            return new jira_webhook_handler_response_dto_1.JiraWebhookHandlerResponseDto('processed', issueKey, eventType, details);
        }
        catch (error) {
            this.logger.error(`Failed to process webhook event: ${requestDto.webhookEvent}`, error.stack);
            return new jira_webhook_handler_response_dto_1.JiraWebhookHandlerResponseDto('error', requestDto.issue?.key || 'unknown', this.extractEventType(requestDto.webhookEvent), { error: error.message });
        }
    }
    extractEventType(webhookEvent) {
        return webhookEvent.replace('jira:', '');
    }
    async handleIssueCreated(requestDto) {
        this.logger.log(`Issue created: ${requestDto.issue?.key}`);
        return {
            action: 'created',
            summary: requestDto.issue?.fields?.summary,
            status: requestDto.issue?.fields?.status?.name,
        };
    }
    async handleIssueUpdated(requestDto) {
        this.logger.log(`Issue updated: ${requestDto.issue?.key}`);
        await this.activateAgentsForTask(requestDto);
        return {
            action: 'updated',
            changes: requestDto.changelog?.items?.length || 0,
            summary: requestDto.issue?.fields?.summary,
        };
    }
    async handleIssueDeleted(requestDto) {
        this.logger.log(`Issue deleted: ${requestDto.issue?.key}`);
        return {
            action: 'deleted',
            issueKey: requestDto.issue?.key,
        };
    }
    async activateAgentsForTask(requestDto) {
        try {
            const issue = requestDto.issue;
            const statusName = issue?.fields?.status?.name;
            if (!statusName || !issue?.key) {
                return;
            }
            this.logger.log(`🔍 Looking for agents for column: ${statusName}`);
            const agents = await this.agentRepository
                .createQueryBuilder('agent')
                .leftJoinAndSelect('agent.instructions', 'instruction')
                .where('agent.status = :status', { status: 'active' })
                .andWhere('instruction.columnName = :columnName', {
                columnName: statusName,
            })
                .andWhere('instruction.isActive = :isActive', { isActive: true })
                .getMany();
            this.logger.log(`🤖 Found ${agents.length} agents for column: ${statusName}`);
            const allAgents = await this.agentRepository.find({
                relations: ['instructions'],
            });
            this.logger.log(`📊 Total agents in DB: ${allAgents.length}`);
            allAgents.forEach((agent) => {
                this.logger.log(`Agent: ${agent.name}, Status: ${agent.status}, Instructions: ${agent.instructions?.length || 0}`);
            });
            for (const agent of agents) {
                await this.activateAgent(agent, requestDto);
            }
        }
        catch (error) {
            this.logger.error('Failed to activate agents for task', error.stack);
        }
    }
    async activateAgent(agent, requestDto) {
        try {
            const issue = requestDto.issue;
            this.logger.log(`🤖 Activating agent: ${agent.name} for task: ${issue?.key}`);
            let creatorEmail = issue?.fields?.creator?.emailAddress;
            let assigneeEmail = issue?.fields?.assignee?.emailAddress;
            if (!creatorEmail && issue?.fields?.creator?.accountId) {
                try {
                    const config = this.getConfig();
                    const response = await axios_1.default.get(`${config.baseUrl}/rest/api/3/user`, {
                        params: { accountId: issue.fields.creator.accountId },
                        auth: {
                            username: config.username,
                            password: config.apiToken,
                        },
                    });
                    creatorEmail = response.data?.emailAddress;
                    console.log(`Creator email obtained via API: ${creatorEmail}`);
                }
                catch (error) {
                    console.log(`Failed to get creator email: ${error.message}`);
                }
            }
            if (!assigneeEmail && issue?.fields?.assignee?.accountId) {
                try {
                    const config = this.getConfig();
                    console.log(`🔍 Trying multiple API endpoints for assignee: ${issue.fields.assignee.accountId}`);
                    let response = await axios_1.default.get(`${config.baseUrl}/rest/api/3/user`, {
                        params: {
                            accountId: issue.fields.assignee.accountId,
                            expand: 'groups,applicationRoles',
                        },
                        auth: {
                            username: config.username,
                            password: config.apiToken,
                        },
                    });
                    assigneeEmail = response.data?.emailAddress;
                    console.log(`📧 Standard user API email: ${assigneeEmail}`);
                    if (!assigneeEmail) {
                        response = await axios_1.default.get(`${config.baseUrl}/rest/api/3/user/search`, {
                            params: {
                                accountId: issue.fields.assignee.accountId,
                            },
                            auth: {
                                username: config.username,
                                password: config.apiToken,
                            },
                        });
                        assigneeEmail = response.data?.[0]?.emailAddress;
                        console.log(`🔍 Search API email: ${assigneeEmail}`);
                    }
                    console.log(`✅ Final assignee email: ${assigneeEmail}`);
                    console.log(`📋 Full assignee API response:`, JSON.stringify(response.data, null, 2));
                }
                catch (error) {
                    console.log(`❌ Failed to get assignee email: ${error.message}`);
                }
            }
            this.logger.log('📋 Webhook issue data:');
            this.logger.log(`        - Creator: ${issue?.fields?.creator?.displayName}`);
            this.logger.log(`        - Creator Email: ${creatorEmail}`);
            this.logger.log(`        - Assignee: ${issue?.fields?.assignee?.displayName}`);
            this.logger.log(`        - Assignee Email: ${assigneeEmail}`);
            const agentRequest = {
                agentId: agent.id,
                taskId: issue?.key,
                boardId: 'main-kanban-board',
                columnId: issue?.fields?.status?.name?.toLowerCase(),
                columnName: issue?.fields?.status?.name,
                triggerType: 'task_moved_to_column',
                taskData: {
                    key: issue?.key,
                    summary: issue?.fields?.summary,
                    assignee: issue?.fields?.assignee?.displayName,
                    assigneeEmail: assigneeEmail,
                    creator: issue?.fields?.creator?.displayName,
                    creatorEmail: creatorEmail,
                    telegramField: issue?.fields?.customfield_10100,
                    status: issue?.fields?.status?.name,
                },
                additionalContext: {
                    webhookEvent: requestDto.webhookEvent,
                    changelog: requestDto.changelog,
                },
            };
            const response = await axios_1.default.post('http://localhost:3000/ai-agent/execute-action', agentRequest, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000,
            });
            this.logger.log(`✅ Agent ${agent.name} executed successfully:`, response.data?.result);
        }
        catch (error) {
            this.logger.error(`❌ Failed to activate agent ${agent.name}:`, error.message);
        }
    }
};
exports.JiraWebhookHandlerService = JiraWebhookHandlerService;
exports.JiraWebhookHandlerService = JiraWebhookHandlerService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, typeorm_2.InjectRepository)(agent_instruction_entity_1.AgentInstruction)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_1.Repository,
        typeorm_1.Repository])
], JiraWebhookHandlerService);
//# sourceMappingURL=jira-webhook-handler.service.js.map