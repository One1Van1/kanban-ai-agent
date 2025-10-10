import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCachedContextService } from './get-cached-context.service';
import { GetCachedContextResponseDto } from './get-cached-context.response.dto';
import { ApiGetCachedContext } from './openapi.decorator';

@Controller('cache/context')
@ApiTags('GetCachedContext')
export class GetCachedContextController {
  constructor(private readonly service: GetCachedContextService) {}

  @Get(':key')
  @ApiGetCachedContext()
  async handle(
    @Param('key') key: string,
  ): Promise<GetCachedContextResponseDto> {
    return this.service.execute(key);
  }
}
