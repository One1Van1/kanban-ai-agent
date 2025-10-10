import { SendEmailService } from './send-email.service';
import { SendEmailRequestDto } from './send-email.request.dto';
import { SendEmailResponseDto } from './send-email.response.dto';
export declare class SendEmailController {
    private readonly service;
    constructor(service: SendEmailService);
    handle(request: SendEmailRequestDto): Promise<SendEmailResponseDto>;
}
