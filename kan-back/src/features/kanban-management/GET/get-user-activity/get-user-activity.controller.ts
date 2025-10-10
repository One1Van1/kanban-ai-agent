import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserActivityService } from './get-user-activity.service';
import { GetUserActivityRequestDto } from './get-user-activity.request.dto';
import { GetUserActivityResponseDto } from './get-user-activity.response.dto';
import { ApiGetUserActivity } from './openapi.decorator';

@Controller('kanban/users')
@ApiTags('GetUserActivity')
export class GetUserActivityController {
  constructor(private readonly service: GetUserActivityService) {}

  @Get(':id/activity')
  @ApiGetUserActivity()
  async handle(
    @Param('id', ParseUUIDPipe) userId: string,
    @Query() query: GetUserActivityRequestDto,
  ): Promise<GetUserActivityResponseDto> {
    return this.service.execute(userId, query);
  }
}
