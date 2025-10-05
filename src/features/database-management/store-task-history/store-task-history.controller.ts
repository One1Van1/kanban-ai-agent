import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreTaskHistoryService } from './store-task-history.service';
import { StoreTaskHistoryRequestDto } from './store-task-history.request.dto';
import { StoreTaskHistoryResponseDto } from './store-task-history.response.dto';
import { ApiStoreTaskHistory } from './openapi.decorator';

@Controller('database/task-history')
@ApiTags('StoreTaskHistory')
export class StoreTaskHistoryController {
  constructor(private readonly service: StoreTaskHistoryService) {}

  @Post('store')
  @ApiStoreTaskHistory()
  async handle(
    @Body() requestDto: StoreTaskHistoryRequestDto,
  ): Promise<StoreTaskHistoryResponseDto> {
    return this.service.execute(requestDto);
  }
}
