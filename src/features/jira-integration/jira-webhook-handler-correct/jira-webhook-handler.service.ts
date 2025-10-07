import { Injectable, Inject } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

      // Найти всех активных агентов с инструкциями для этой колонки
      const agents = await this.agentRepository
        .createQueryBuilder('agent')
        .leftJoinAndSelect('agent.instructions', 'instruction')
        .where('agent.status = :status', { status: 'active' })
        .andWhere('instruction.columnName = :columnName', {
          columnName: statusName,
        })
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
