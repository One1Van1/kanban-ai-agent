import { Injectable, Inject } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Agent } from '@/entities/agent.entity';
import { AgentInstruction } from '@/entities/agent-instruction.entity';

@Injectable()
export class JiraWebhookHandlerService extends JiraBaseService {
  constructor(
    configService: ConfigService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentInstruction)
    private readonly agentInstructionRepository: Repository<AgentInstruction>,
  ) {
    super(configService);
  }
  async execute(
    requestDto: JiraWebhookHandlerRequestDto,
  ): Promise<JiraWebhookHandlerResponseDto> {
    try {
      this.logger.log(`Processing webhook event: ${requestDto.webhookEvent}`);

      const issueKey = requestDto.issue?.key || 'unknown';
      const eventType = this.extractEventType(requestDto.webhookEvent);

      // Обработка различных типов событий
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

      return new JiraWebhookHandlerResponseDto(
        'processed',
        issueKey,
        eventType,
        details,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process webhook event: ${requestDto.webhookEvent}`,
        error.stack,
      );

      return new JiraWebhookHandlerResponseDto(
        'error',
        requestDto.issue?.key || 'unknown',
        this.extractEventType(requestDto.webhookEvent),
        { error: error.message },
      );
    }
  }

  private extractEventType(webhookEvent: string): string {
    return webhookEvent.replace('jira:', '');
  }

  private async handleIssueCreated(requestDto: JiraWebhookHandlerRequestDto) {
    this.logger.log(`Issue created: ${requestDto.issue?.key}`);
    return {
      action: 'created',
      summary: requestDto.issue?.fields?.summary,
      status: requestDto.issue?.fields?.status?.name,
    };
  }

  private async handleIssueUpdated(requestDto: JiraWebhookHandlerRequestDto) {
    this.logger.log(`Issue updated: ${requestDto.issue?.key}`);

    // 🚀 Активируем агентов для этой задачи
    await this.activateAgentsForTask(requestDto);

    return {
      action: 'updated',
      changes: requestDto.changelog?.items?.length || 0,
      summary: requestDto.issue?.fields?.summary,
    };
  }

  private async handleIssueDeleted(requestDto: JiraWebhookHandlerRequestDto) {
    this.logger.log(`Issue deleted: ${requestDto.issue?.key}`);
    return {
      action: 'deleted',
      issueKey: requestDto.issue?.key,
    };
  }

  /**
   * 🤖 Универсальная активация агентов для задачи
   */
  private async activateAgentsForTask(
    requestDto: JiraWebhookHandlerRequestDto,
  ) {
    try {
      const issue = requestDto.issue;
      const statusName = issue?.fields?.status?.name;

      if (!statusName || !issue?.key) {
        return;
      }

      this.logger.log(`🔍 Looking for agents for column: ${statusName}`);

      // Найти всех активных агентов с инструкциями для этой колонки или для всех колонок
      const agents = await this.agentRepository
        .createQueryBuilder('agent')
        .leftJoinAndSelect('agent.instructions', 'instruction')
        .where('agent.status = :status', { status: 'active' })
        .andWhere(
          '(instruction.columnName = :columnName OR instruction.columnName = :allColumns)',
          {
            columnName: statusName,
            allColumns: 'All Columns',
          },
        )
        .andWhere('instruction.isActive = :isActive', { isActive: true })
        .getMany();

      this.logger.log(
        `🤖 Found ${agents.length} agents for column: ${statusName}`,
      );

      // 🔍 ОТЛАДКА: Покажем все агенты в базе
      const allAgents = await this.agentRepository.find({
        relations: ['instructions'],
      });
      this.logger.log(`📊 Total agents in DB: ${allAgents.length}`);
      allAgents.forEach((agent) => {
        this.logger.log(
          `Agent: ${agent.name}, Status: ${agent.status}, Instructions: ${agent.instructions?.length || 0}`,
        );
      });

      // Активировать каждого агента
      for (const agent of agents) {
        await this.activateAgent(agent, requestDto);
      }
    } catch (error) {
      this.logger.error('Failed to activate agents for task', error.stack);
    }
  }

  /**
   * 🚀 Активация конкретного агента
   */
  private async activateAgent(
    agent: Agent,
    requestDto: JiraWebhookHandlerRequestDto,
  ) {
    try {
      const issue = requestDto.issue;

      this.logger.log(
        `🤖 Activating agent: ${agent.name} for task: ${issue?.key}`,
      );

      // Получаем email адреса через Jira API
      let creatorEmail = issue?.fields?.creator?.emailAddress;
      let assigneeEmail = issue?.fields?.assignee?.emailAddress;

      // Если email не в webhook, получаем через API
      if (!creatorEmail && issue?.fields?.creator?.accountId) {
        try {
          const config = this.getConfig();
          const response = await axios.get(
            `${config.baseUrl}/rest/api/3/user`,
            {
              params: { accountId: issue.fields.creator.accountId },
              auth: {
                username: config.username,
                password: config.apiToken,
              },
            },
          );
          creatorEmail = response.data?.emailAddress;
          console.log(`Creator email obtained via API: ${creatorEmail}`);
        } catch (error) {
          console.log(`Failed to get creator email: ${error.message}`);
        }
      }

      if (!assigneeEmail && issue?.fields?.assignee?.accountId) {
        try {
          const config = this.getConfig();

          console.log(
            `🔍 Trying multiple API endpoints for assignee: ${issue.fields.assignee.accountId}`,
          );

          // 1. Стандартный user endpoint
          let response = await axios.get(`${config.baseUrl}/rest/api/3/user`, {
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

          // 2. Если не получилось, пробуем search API
          if (!assigneeEmail) {
            response = await axios.get(
              `${config.baseUrl}/rest/api/3/user/search`,
              {
                params: {
                  accountId: issue.fields.assignee.accountId,
                },
                auth: {
                  username: config.username,
                  password: config.apiToken,
                },
              },
            );
            assigneeEmail = response.data?.[0]?.emailAddress;
            console.log(`🔍 Search API email: ${assigneeEmail}`);
          }

          console.log(`✅ Final assignee email: ${assigneeEmail}`);
          console.log(
            `📋 Full assignee API response:`,
            JSON.stringify(response.data, null, 2),
          );
        } catch (error) {
          console.log(`❌ Failed to get assignee email: ${error.message}`);
        }
      }

      // 🔍 Логируем данные для отладки
      this.logger.log('📋 Webhook issue data:');
      this.logger.log(
        `        - Creator: ${issue?.fields?.creator?.displayName}`,
      );
      this.logger.log(`        - Creator Email: ${creatorEmail}`);
      this.logger.log(
        `        - Assignee: ${issue?.fields?.assignee?.displayName}`,
      );
      this.logger.log(`        - Assignee Email: ${assigneeEmail}`);

      // Подготовить данные для агента
      const agentRequest = {
        agentId: agent.id,
        taskId: issue?.key,
        boardId: 'main-kanban-board', // TODO: получать из настроек
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

      // Вызвать агента через HTTP API
      const response = await axios.post(
        'http://localhost:3000/ai-agent/execute-action',
        agentRequest,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        },
      );

      this.logger.log(
        `✅ Agent ${agent.name} executed successfully:`,
        response.data?.result,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to activate agent ${agent.name}:`,
        error.message,
      );
    }
  }
}
