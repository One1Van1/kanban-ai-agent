import { Controller, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangeTaskStatusService } from './change-task-status.service';
import { ChangeTaskStatusRequestDto } from './change-task-status.request.dto';
import { ChangeTaskStatusResponseDto } from './change-task-status.response.dto';
import { ApiChangeTaskStatus } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('ChangeTaskStatus')
export class ChangeTaskStatusController {
  constructor(private readonly service: ChangeTaskStatusService) {}

  @Patch(':id/status')
  @ApiChangeTaskStatus()
  async handle(
    @Param('id') taskId: string,
    @Body() statusDto: ChangeTaskStatusRequestDto,
  ): Promise<ChangeTaskStatusResponseDto> {
    return this.service.execute(taskId, statusDto);
  }
}
