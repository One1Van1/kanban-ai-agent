import { GetColumnTasksService } from './get-column-tasks.service';
import { GetColumnTasksRequestDto } from './get-column-tasks.request.dto';
import { GetColumnTasksResponseDto } from './get-column-tasks.response.dto';
export declare class GetColumnTasksController {
    private readonly service;
    constructor(service: GetColumnTasksService);
    handle(columnStatus: string, query: Omit<GetColumnTasksRequestDto, 'columnStatus'>): Promise<GetColumnTasksResponseDto>;
}
