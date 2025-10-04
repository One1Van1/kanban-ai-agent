import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { AnalyzeBeforeAfterPhotosRequestDto } from './analyze-before-after-photos.request.dto';
import { AnalyzeBeforeAfterPhotosResponseDto } from './analyze-before-after-photos.response.dto';
import { ApiAnalyzeBeforeAfterPhotos } from './openapi.decorator';

@Controller('photo-analysis')
@ApiTags('AnalyzeBeforeAfterPhotos')
export class AnalyzeBeforeAfterPhotosController {
  constructor(private readonly service: AnalyzeBeforeAfterPhotosService) {}

  @Post('analyze-before-after')
  @ApiAnalyzeBeforeAfterPhotos()
  async handle(
    @Body() requestDto: AnalyzeBeforeAfterPhotosRequestDto,
  ): Promise<AnalyzeBeforeAfterPhotosResponseDto> {
    return this.service.execute(requestDto);
  }
}
