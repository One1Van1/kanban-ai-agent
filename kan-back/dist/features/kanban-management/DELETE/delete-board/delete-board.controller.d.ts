import { DeleteBoardService } from './delete-board.service';
import { DeleteBoardRequestDto } from './delete-board.request.dto';
import { DeleteBoardResponseDto } from './delete-board.response.dto';
export declare class DeleteBoardController {
    private readonly service;
    constructor(service: DeleteBoardService);
    deleteBoard(boardId: string, requestDto: DeleteBoardRequestDto): Promise<DeleteBoardResponseDto>;
}
