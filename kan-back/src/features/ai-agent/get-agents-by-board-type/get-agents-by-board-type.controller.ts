import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoardType } from '../../../types/board-integration.interface';
import { GetAgentsByBoardTypeService } from './get-agents-by-board-type.service';
import { GetAgentsByBoardTypeResponseDto } from './get-agents-by-board-type.response.dto';
import { ApiGetAgentsByBoardType } from './openapi.decorator';

@Controller('agents')
@ApiTags('GetAgentsByBoardType')
export class GetAgentsByBoardTypeController {
  constructor(private readonly service: GetAgentsByBoardTypeService) {}

  @Get('by-board-type/:boardType')
  @ApiGetAgentsByBoardType()
  async handle(
    @Param('boardType') boardTypeParam: string,
  ): Promise<GetAgentsByBoardTypeResponseDto> {
    // Validate that the boardType is a valid enum value
    if (!Object.values(BoardType).includes(boardTypeParam as BoardType)) {
      throw new BadRequestException(
        `Invalid board type: ${boardTypeParam}. Supported types: ${Object.values(BoardType).join(', ')}`,
      );
    }

    const boardType = boardTypeParam as BoardType;
    return this.service.execute(boardType);
  }
}
