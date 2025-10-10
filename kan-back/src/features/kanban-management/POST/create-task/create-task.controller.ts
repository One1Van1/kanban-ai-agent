import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskService } from './create-task.service';
import { CreateTaskRequestDto } from './create-task.request.dto';
import { CreateTaskResponseDto } from './create-task.response.dto';
import { ApiCreateTask } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('CreateTask')
export class CreateTaskController {
  constructor(private readonly service: CreateTaskService) {}

  @Post()
  @ApiCreateTask()
  async handle(
    @Body() createDto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    return this.service.execute(createDto);
  }
}
