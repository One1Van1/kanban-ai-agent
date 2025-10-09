import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskDetailsService } from './get-task-details.service';
import { GetTaskDetailsResponseDto } from './get-task-details.response.dto';
import { ApiGetTaskDetails } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('GetTaskDetails')
export class GetTaskDetailsController {
  constructor(private readonly service: GetTaskDetailsService) {}

  @Get(':id')
  @ApiGetTaskDetails()
  async handle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetTaskDetailsResponseDto> {
    return this.service.execute(id);
  }
}
