import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAllAgentsService } from './get-all-agents.service';
import { GetAllAgentsResponseDto } from './get-all-agents.response.dto';
import { ApiGetAllAgents } from './openapi.decorator';

@Controller('agents')
@ApiTags('GetAllAgents')
export class GetAllAgentsController {
  constructor(private readonly service: GetAllAgentsService) {}

  @Get()
  @ApiGetAllAgents()
  async handle(): Promise<GetAllAgentsResponseDto> {
    return this.service.execute();
  }
}
