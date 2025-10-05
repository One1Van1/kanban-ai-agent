import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigureContextSourcesService } from './configure-context-sources.service';
import { ConfigureContextSourcesRequestDto } from './configure-context-sources.request.dto';
import { ConfigureContextSourcesResponseDto } from './configure-context-sources.response.dto';
import { ApiConfigureContextSources } from './openapi.decorator';

@Controller('context-management')
@ApiTags('ConfigureContextSources')
export class ConfigureContextSourcesController {
  constructor(private readonly service: ConfigureContextSourcesService) {}

  @Post('configure-sources')
  @ApiConfigureContextSources()
  async handle(
    @Body() request: ConfigureContextSourcesRequestDto,
  ): Promise<ConfigureContextSourcesResponseDto> {
    return this.service.execute(request);
  }
}
