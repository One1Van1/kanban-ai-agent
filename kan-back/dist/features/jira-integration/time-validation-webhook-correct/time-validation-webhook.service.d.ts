import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { TimeValidationWebhookRequestDto } from './time-validation-webhook.request.dto';
import { TimeValidationWebhookResponseDto } from './time-validation-webhook.response.dto';
export declare class TimeValidationWebhookService extends JiraBaseService {
    execute(requestDto: TimeValidationWebhookRequestDto): Promise<TimeValidationWebhookResponseDto>;
    private validateTimeSpent;
}
