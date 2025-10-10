import { UpdateBoardColumnService } from './update-board-column.service';
import { UpdateBoardColumnRequestDto } from './update-board-column.request.dto';
import { UpdateBoardColumnResponseDto } from './update-board-column.response.dto';
export declare class UpdateBoardColumnController {
    private readonly service;
    constructor(service: UpdateBoardColumnService);
    updateColumn(columnId: string, requestDto: UpdateBoardColumnRequestDto): Promise<UpdateBoardColumnResponseDto>;
}
