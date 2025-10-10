import { ProcessReportTaskRequestDto } from './process-report-task.request.dto';
import { ProcessReportTaskResponseDto } from './process-report-task.response.dto';
import { SearchTasksService } from '../../jira-integration/search-tasks-correct/search-tasks.service';
import { AddTaskCommentService } from '../../jira-integration/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../../jira-integration/move-task-correct/move-task.service';
import { GenerateReportService } from '../generate-report/generate-report.service';
export declare class ProcessReportTaskService {
    private readonly searchTasksService;
    private readonly addTaskCommentService;
    private readonly moveTaskService;
    private readonly generateReportService;
    private readonly logger;
    constructor(searchTasksService: SearchTasksService, addTaskCommentService: AddTaskCommentService, moveTaskService: MoveTaskService, generateReportService: GenerateReportService);
    execute(dto: ProcessReportTaskRequestDto): Promise<ProcessReportTaskResponseDto>;
    private extractDescriptionText;
    private extractTextFromContent;
    private formatReportComment;
}
