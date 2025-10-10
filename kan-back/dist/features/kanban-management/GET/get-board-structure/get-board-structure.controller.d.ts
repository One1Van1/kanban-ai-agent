import { GetBoardStructureService } from './get-board-structure.service';
import { GetBoardStructureRequestDto } from './get-board-structure.request.dto';
import { GetBoardStructureResponseDto } from './get-board-structure.response.dto';
export declare class GetBoardStructureController {
    private readonly service;
    constructor(service: GetBoardStructureService);
    handle(queryDto: GetBoardStructureRequestDto): Promise<GetBoardStructureResponseDto>;
}
