import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAvailableStatusesService } from './get-available-statuses.service';
import { GetAvailableStatusesResponseDto } from './get-available-statuses.response.dto';
import { ApiGetAvailableStatuses } from './openapi.decorator';

@Controller('kanban/statuses')
@ApiTags('GetAvailableStatuses')
export class GetAvailableStatusesController {
  constructor(private readonly service: GetAvailableStatusesService) {}

  @Get()
  @ApiGetAvailableStatuses()
  async handle(): Promise<GetAvailableStatusesResponseDto> {
    return this.service.execute();
  }
}
