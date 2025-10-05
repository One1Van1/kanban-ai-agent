import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { SendTelegramRequestDto } from './send-telegram.request.dto';
import { SendTelegramResponseDto } from './send-telegram.response.dto';

@Injectable()
export class SendTelegramService implements OnModuleInit {
  private readonly logger = new Logger(SendTelegramService.name);
  private bot: Telegraf;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeBot();
  }

  private initializeBot() {
    const telegramConfig = this.configService.get('notifications.telegram');

    if (!telegramConfig.botToken) {
      this.logger.warn(
        'Telegram bot token not configured. Telegram notifications will be disabled.',
      );
      return;
    }

    this.bot = new Telegraf(telegramConfig.botToken);
    this.logger.log('Telegram bot initialized successfully');
  }

  async execute(
    request: SendTelegramRequestDto,
  ): Promise<SendTelegramResponseDto> {
    try {
      if (!this.bot) {
        throw new Error('Telegram bot is not configured');
      }

      const options: any = {
        parse_mode: request.parseMode,
        disable_web_page_preview: request.disableWebPagePreview,
        disable_notification: request.disableNotification,
      };

      // Remove undefined values
      Object.keys(options).forEach((key) => {
        if (options[key] === undefined) {
          delete options[key];
        }
      });

      const result = await this.bot.telegram.sendMessage(
        request.chatId,
        request.text,
        options,
      );

      this.logger.log(
        `Telegram message sent successfully to chat ${request.chatId}. MessageId: ${result.message_id}`,
      );

      return new SendTelegramResponseDto(
        true,
        'Telegram message sent successfully',
        result.message_id,
        request.chatId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send Telegram message to chat ${request.chatId}:`,
        error,
      );

      return new SendTelegramResponseDto(
        false,
        `Failed to send Telegram message: ${error.message}`,
      );
    }
  }
}
