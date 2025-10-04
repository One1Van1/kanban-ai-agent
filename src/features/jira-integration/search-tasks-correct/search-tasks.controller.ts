import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchTasksService } from './search-tasks.service';
import { SearchTasksRequestDto } from './search-tasks.request.dto';
import { SearchTasksResponseDto } from './search-tasks.response.dto';
import { ApiSearchTasks } from './openapi.decorator';

@Controller('jira')
@ApiTags('SearchTasks')
export class SearchTasksController {
  constructor(private readonly service: SearchTasksService) {}

  @Post('search')
  @ApiSearchTasks()
  async handle(
    @Body() requestDto: SearchTasksRequestDto,
  ): Promise<SearchTasksResponseDto> {
    return this.service.execute(requestDto);
  }
}
