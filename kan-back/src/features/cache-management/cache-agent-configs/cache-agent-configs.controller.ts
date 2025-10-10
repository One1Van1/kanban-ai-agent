import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CacheAgentConfigsService } from './cache-agent-configs.service';
import { CacheAgentConfigsRequestDto } from './cache-agent-configs.request.dto';
import { CacheAgentConfigsResponseDto } from './cache-agent-configs.response.dto';
import { ApiCacheAgentConfigs } from './openapi.decorator';

@Controller('cache/agent-configs')
@ApiTags('CacheAgentConfigs')
export class CacheAgentConfigsController {
  constructor(private readonly service: CacheAgentConfigsService) {}

  @Post()
  @ApiCacheAgentConfigs()
  async handle(
    @Body() request: CacheAgentConfigsRequestDto,
  ): Promise<CacheAgentConfigsResponseDto> {
    return this.service.execute(request);
  }
}
