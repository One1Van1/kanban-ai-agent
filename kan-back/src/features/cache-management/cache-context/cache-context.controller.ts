import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CacheContextService } from './cache-context.service';
import { CacheContextRequestDto } from './cache-context.request.dto';
import { CacheContextResponseDto } from './cache-context.response.dto';
import { ApiCacheContext } from './openapi.decorator';

@Controller('cache/context')
@ApiTags('CacheContext')
export class CacheContextController {
  constructor(private readonly service: CacheContextService) {}

  @Post()
  @ApiCacheContext()
  async handle(
    @Body() request: CacheContextRequestDto,
  ): Promise<CacheContextResponseDto> {
    return this.service.execute(request);
  }
}
