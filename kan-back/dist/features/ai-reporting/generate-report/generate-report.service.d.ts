import { ConfigService } from '@nestjs/config';
import { GenerateReportRequestDto } from './generate-report.request.dto';
import { GenerateReportResponseDto } from './generate-report.response.dto';
import { SearchTasksService } from '../../jira-integration/search-tasks-correct/search-tasks.service';
export declare class GenerateReportService {
    private readonly configService;
    private readonly searchTasksService;
    private readonly logger;
    constructor(configService: ConfigService, searchTasksService: SearchTasksService);
    execute(dto: GenerateReportRequestDto): Promise<GenerateReportResponseDto>;
    private parseDateRange;
    private findHaircutTasks;
    private extractClaudeAnalyses;
    private extractCommentText;
    private extractTextFromContent;
    private parseClaudeAnalysis;
    private calculateStatistics;
    private getPopularStyles;
    private generateRecommendations;
}
