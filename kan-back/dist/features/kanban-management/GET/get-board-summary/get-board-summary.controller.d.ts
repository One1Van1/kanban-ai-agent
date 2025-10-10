import { GetBoardSummaryService } from './get-board-summary.service';
import { GetBoardSummaryRequestDto } from './get-board-summary.request.dto';
import { GetBoardSummaryResponseDto } from './get-board-summary.response.dto';
export declare class GetBoardSummaryController {
    private readonly service;
    constructor(service: GetBoardSummaryService);
    handle(query: GetBoardSummaryRequestDto): Promise<GetBoardSummaryResponseDto>;
}
