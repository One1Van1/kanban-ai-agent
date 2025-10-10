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

      // 🔄 Auto-resolve username to chat ID if needed
      const chatId = await this.resolveChatId(request.chatId);

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
        chatId,
        request.text,
        options,
      );

      this.logger.log(
        `Telegram message sent successfully to chat ${chatId}. MessageId: ${result.message_id}`,
      );

      return new SendTelegramResponseDto(
        true,
        'Telegram message sent successfully',
        result.message_id,
        chatId,
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

  /**
   * 🔄 Автоматически преобразует username в chat ID
   */
  private async resolveChatId(input: string): Promise<string> {
    // Если это уже число (chat ID), возвращаем как есть
    if (/^\d+$/.test(input) || /^-\d+$/.test(input)) {
      return input;
    }

    // Если это username, пробуем отправить напрямую
    if (input.startsWith('@') || /^[a-zA-Z0-9_]+$/.test(input)) {
      const usernameWithAt = input.startsWith('@') ? input : `@${input}`;
      this.logger.log(`📱 Sending to username: ${usernameWithAt}`);
      return usernameWithAt;
    }

    return input;
  }
}
