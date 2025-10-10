import { ConfigService } from '@nestjs/config';
import { ProcessWebhookBeforeAfterDto, ProcessWebhookBeforeAfterResponseDto } from './process-webhook-before-after.dto';
export declare class ProcessWebhookBeforeAfterService {
    private readonly configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly processingTasks;
    constructor(configService: ConfigService);
    processWebhookBeforeAfter(dto: ProcessWebhookBeforeAfterDto): Promise<ProcessWebhookBeforeAfterResponseDto>;
    private validateClaudeConditions;
    private checkExistingClaudeAnalysis;
    private extractBeforeAfterPhotos;
    private downloadPhotoAsBase64;
    private analyzeWithClaude;
    private postResultsToJira;
    private moveTaskToQuestionsWithComment;
    private moveTaskToDone;
    private hasPhotoAttachments;
    private hasNoResultComment;
    private hasSuccessfulClaudeAnalysis;
    getServiceHealth(): Promise<{
        status: string;
        claudeEndpoint: string;
        timestamp: string;
    }>;
}
