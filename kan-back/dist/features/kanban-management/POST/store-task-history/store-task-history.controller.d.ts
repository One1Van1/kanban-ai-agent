import { StoreTaskHistoryService } from './store-task-history.service';
import { StoreTaskHistoryRequestDto } from './store-task-history.request.dto';
import { StoreTaskHistoryResponseDto } from './store-task-history.response.dto';
export declare class StoreTaskHistoryController {
    private readonly service;
    constructor(service: StoreTaskHistoryService);
    handle(requestDto: StoreTaskHistoryRequestDto): Promise<StoreTaskHistoryResponseDto>;
}
