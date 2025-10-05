import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendTelegramService } from './send-telegram.service';
import { SendTelegramRequestDto } from './send-telegram.request.dto';
import { SendTelegramResponseDto } from './send-telegram.response.dto';
import { ApiSendTelegram } from './openapi.decorator';

@Controller('notifications')
@ApiTags('SendTelegram')
export class SendTelegramController {
  constructor(private readonly service: SendTelegramService) {}

  @Post('telegram')
  @ApiSendTelegram()
  async handle(
    @Body() request: SendTelegramRequestDto,
  ): Promise<SendTelegramResponseDto> {
    return this.service.execute(request);
  }
}
