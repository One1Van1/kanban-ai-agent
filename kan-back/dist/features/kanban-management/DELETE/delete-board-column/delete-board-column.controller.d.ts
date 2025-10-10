import { DeleteBoardColumnService } from './delete-board-column.service';
import { DeleteBoardColumnRequestDto } from './delete-board-column.request.dto';
import { DeleteBoardColumnResponseDto } from './delete-board-column.response.dto';
export declare class DeleteBoardColumnController {
    private readonly service;
    constructor(service: DeleteBoardColumnService);
    deleteColumn(columnId: string, requestDto: DeleteBoardColumnRequestDto): Promise<DeleteBoardColumnResponseDto>;
}
