import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { TimeValidationWebhookRequestDto } from './time-validation-webhook.request.dto';
import { TimeValidationWebhookResponseDto } from './time-validation-webhook.response.dto';
export declare class TimeValidationWebhookController {
    private readonly service;
    constructor(service: TimeValidationWebhookService);
    handle(requestDto: TimeValidationWebhookRequestDto): Promise<TimeValidationWebhookResponseDto>;
}
