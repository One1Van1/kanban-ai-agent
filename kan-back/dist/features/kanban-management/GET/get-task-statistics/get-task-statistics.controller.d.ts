import { GetTaskStatisticsService } from './get-task-statistics.service';
import { GetTaskStatisticsQueryDto } from './get-task-statistics.request.dto';
import { GetTaskStatisticsResponseDto } from './get-task-statistics.response.dto';
export declare class GetTaskStatisticsController {
    private readonly service;
    constructor(service: GetTaskStatisticsService);
    handle(query: GetTaskStatisticsQueryDto): Promise<GetTaskStatisticsResponseDto>;
}
