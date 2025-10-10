import { ReorderBoardColumnsService } from './reorder-board-columns.service';
import { ReorderBoardColumnsRequestDto } from './reorder-board-columns.request.dto';
import { ReorderBoardColumnsResponseDto } from './reorder-board-columns.response.dto';
export declare class ReorderBoardColumnsController {
    private readonly service;
    constructor(service: ReorderBoardColumnsService);
    handle(requestDto: ReorderBoardColumnsRequestDto): Promise<ReorderBoardColumnsResponseDto>;
}
