import { CreateBoardColumnService } from './create-board-column.service';
import { CreateBoardColumnRequestDto } from './create-board-column.request.dto';
import { CreateBoardColumnResponseDto } from './create-board-column.response.dto';
export declare class CreateBoardColumnController {
    private readonly service;
    constructor(service: CreateBoardColumnService);
    createColumn(requestDto: CreateBoardColumnRequestDto): Promise<CreateBoardColumnResponseDto>;
}
