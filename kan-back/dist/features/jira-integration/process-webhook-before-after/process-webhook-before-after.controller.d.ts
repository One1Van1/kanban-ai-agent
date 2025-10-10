import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';
import { ProcessWebhookBeforeAfterDto, ProcessWebhookBeforeAfterResponseDto } from './process-webhook-before-after.dto';
export declare class ProcessWebhookBeforeAfterController {
    private readonly processWebhookBeforeAfterService;
    private readonly logger;
    constructor(processWebhookBeforeAfterService: ProcessWebhookBeforeAfterService);
    processWebhookBeforeAfter(webhookDto: ProcessWebhookBeforeAfterDto): Promise<ProcessWebhookBeforeAfterResponseDto>;
    getHealth(): Promise<any>;
    getConfig(): Promise<any>;
}
