import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskFilesByUserService } from './get-task-files-by-user.service';
import { GetTaskFilesByUserQueryDto } from './get-task-files-by-user.query.dto';
import { GetTaskFilesByUserResponseDto } from './get-task-files-by-user.response.dto';
import { ApiGetTaskFilesByUser } from './openapi.decorator';

@Controller('jira')
@ApiTags('GetTaskFilesByUser')
export class GetTaskFilesByUserController {
  constructor(private readonly service: GetTaskFilesByUserService) {}

  @Get('tasks/:taskId/files/user/:userId')
  @ApiGetTaskFilesByUser()
  async handle(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @Query() query: GetTaskFilesByUserQueryDto,
  ): Promise<GetTaskFilesByUserResponseDto> {
    return this.service.execute(taskId, userId, query);
  }
}
