import { JiraWebhookHandlerService } from './jira-webhook-handler.service';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';
export declare class JiraWebhookHandlerController {
    private readonly service;
    constructor(service: JiraWebhookHandlerService);
    handle(requestDto: JiraWebhookHandlerRequestDto): Promise<JiraWebhookHandlerResponseDto>;
}
