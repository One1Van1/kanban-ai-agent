import { SendTelegramService } from './send-telegram.service';
import { SendTelegramRequestDto } from './send-telegram.request.dto';
import { SendTelegramResponseDto } from './send-telegram.response.dto';
export declare class SendTelegramController {
    private readonly service;
    constructor(service: SendTelegramService);
    handle(request: SendTelegramRequestDto): Promise<SendTelegramResponseDto>;
}
