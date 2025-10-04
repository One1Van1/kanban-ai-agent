import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';

@Injectable()
export class JiraWebhookHandlerService extends JiraBaseService {
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
}
