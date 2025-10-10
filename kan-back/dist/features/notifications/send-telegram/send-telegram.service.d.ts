import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendTelegramRequestDto } from './send-telegram.request.dto';
import { SendTelegramResponseDto } from './send-telegram.response.dto';
export declare class SendTelegramService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private bot;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializeBot;
    execute(request: SendTelegramRequestDto): Promise<SendTelegramResponseDto>;
    private resolveChatId;
}
