import { ProcessReportTaskService } from './process-report-task.service';
import { ProcessReportTaskRequestDto } from './process-report-task.request.dto';
import { ProcessReportTaskResponseDto } from './process-report-task.response.dto';
export declare class ProcessReportTaskController {
    private readonly service;
    private readonly logger;
    constructor(service: ProcessReportTaskService);
    handle(dto: ProcessReportTaskRequestDto): Promise<ProcessReportTaskResponseDto>;
}
