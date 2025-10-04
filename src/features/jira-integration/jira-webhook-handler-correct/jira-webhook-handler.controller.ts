import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JiraWebhookHandlerService } from './jira-webhook-handler.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';
import { ApiJiraWebhookHandler } from './openapi.decorator';

@Controller('jira/webhook')
@ApiTags('JiraWebhookHandler')
export class JiraWebhookHandlerController {
  constructor(private readonly service: JiraWebhookHandlerService) {}

  @Post()
  @ApiJiraWebhookHandler()
  async handle(
    @Body() requestDto: JiraWebhookHandlerRequestDto,
  ): Promise<JiraWebhookHandlerResponseDto> {
    return this.service.execute(requestDto);
  }
}
