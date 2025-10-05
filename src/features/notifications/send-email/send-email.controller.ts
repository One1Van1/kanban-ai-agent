import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailService } from './send-email.service';
import { SendEmailRequestDto } from './send-email.request.dto';
import { SendEmailResponseDto } from './send-email.response.dto';
import { ApiSendEmail } from './openapi.decorator';

@Controller('notifications')
@ApiTags('SendEmail')
export class SendEmailController {
  constructor(private readonly service: SendEmailService) {}

  @Post('email')
  @ApiSendEmail()
  async handle(
    @Body() request: SendEmailRequestDto,
  ): Promise<SendEmailResponseDto> {
    return this.service.execute(request);
  }
}
