import { Controller, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTaskAssignmentService } from './update-task-assignment.service';
import { UpdateTaskAssignmentRequestDto } from './update-task-assignment.request.dto';
import { UpdateTaskAssignmentResponseDto } from './update-task-assignment.response.dto';
import { UpdateTaskAssignmentOpenApi } from './update-task-assignment.openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('UpdateTaskAssignment')
export class UpdateTaskAssignmentController {
  constructor(private readonly service: UpdateTaskAssignmentService) {}

  @Patch(':id/assignment')
  @UpdateTaskAssignmentOpenApi()
  async updateAssignment(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: UpdateTaskAssignmentRequestDto,
  ): Promise<UpdateTaskAssignmentResponseDto> {
    return this.service.updateAssignment(taskId, requestDto);
  }
}
