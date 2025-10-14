import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAvailableModelsService } from './get-available-models.service';
import { GetAvailableModelsResponseDto } from './get-available-models.response.dto';
import { ApiGetAvailableModels } from './openapi.decorator';

@Controller('ai-agent')
@ApiTags('GetAvailableModels')
export class GetAvailableModelsController {
  constructor(
    private readonly getAvailableModelsService: GetAvailableModelsService,
  ) {}

  @Get('available-models')
  @ApiGetAvailableModels()
  async handle(): Promise<GetAvailableModelsResponseDto> {
    return this.getAvailableModelsService.execute();
  }
}
