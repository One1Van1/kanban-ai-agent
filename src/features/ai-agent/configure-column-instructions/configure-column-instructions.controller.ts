import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigureColumnInstructionsService } from './configure-column-instructions.service';
import { ConfigureColumnInstructionsRequestDto } from './configure-column-instructions.request.dto';
import { ConfigureColumnInstructionsResponseDto } from './configure-column-instructions.response.dto';
import { ApiConfigureColumnInstructions } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('ConfigureColumnInstructions')
export class ConfigureColumnInstructionsController {
  constructor(private readonly service: ConfigureColumnInstructionsService) {}

  @Post('configure-column-instructions')
  @ApiConfigureColumnInstructions()
  async handle(
    @Body() request: ConfigureColumnInstructionsRequestDto,
  ): Promise<ConfigureColumnInstructionsResponseDto> {
    return this.service.execute(request);
  }
}
