import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAgentByIdService } from './get-agent-by-id.service';
import { GetAgentByIdResponseDto } from './get-agent-by-id.response.dto';
import { ApiGetAgentById } from './openapi.decorator';

@Controller('agents')
@ApiTags('GetAgentById')
export class GetAgentByIdController {
  constructor(private readonly service: GetAgentByIdService) {}

  @Get(':id')
  @ApiGetAgentById()
  async handle(@Param('id') id: string): Promise<GetAgentByIdResponseDto> {
    return this.service.execute(id);
  }
}
