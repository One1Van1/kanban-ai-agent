import { Controller, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTaskDetailsService } from './update-task-details.service';
import { UpdateTaskDetailsRequestDto } from './update-task-details.request.dto';
import { UpdateTaskDetailsResponseDto } from './update-task-details.response.dto';
import { UpdateTaskDetailsOpenApi } from './update-task-details.openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('UpdateTaskDetails')
export class UpdateTaskDetailsController {
  constructor(private readonly service: UpdateTaskDetailsService) {}

  @Patch(':id/details')
  @UpdateTaskDetailsOpenApi()
  async updateDetails(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: UpdateTaskDetailsRequestDto,
  ): Promise<UpdateTaskDetailsResponseDto> {
    return this.service.updateDetails(taskId, requestDto);
  }
}
