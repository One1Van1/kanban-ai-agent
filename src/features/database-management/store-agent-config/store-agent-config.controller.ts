import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreAgentConfigService } from './store-agent-config.service';
import { StoreAgentConfigRequestDto } from './store-agent-config.request.dto';
import { StoreAgentConfigResponseDto } from './store-agent-config.response.dto';
import { ApiStoreAgentConfig } from './openapi.decorator';

@Controller('database/agents')
@ApiTags('StoreAgentConfig')
export class StoreAgentConfigController {
  constructor(private readonly service: StoreAgentConfigService) {}

  @Post('store-config')
  @ApiStoreAgentConfig()
  async handle(
    @Body() requestDto: StoreAgentConfigRequestDto,
  ): Promise<StoreAgentConfigResponseDto> {
    return this.service.execute(requestDto);
  }
}
