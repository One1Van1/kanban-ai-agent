import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Telegram Utils')
@Controller('telegram-utils')
export class TelegramUtilsController {
  @Get('get-chat-id')
  @ApiOperation({
    summary: 'Получить инструкции для получения chat ID',
    description: 'Возвращает инструкции, как узнать свой Telegram chat ID',
  })
  getChatIdInstructions() {
    return {
      message: 'Чтобы узнать свой Telegram chat ID:',
      steps: [
        '1. Написать боту @userinfobot в Telegram',
        '2. Отправить команду /start',
        '3. Бот вернет ваш chat ID',
        '4. Использовать этот ID для настройки уведомлений',
      ],
      example: {
        chatId: '123456789',
        usage: 'Используйте этот ID в поле telegramField в задачах Jira',
      },
    };
  }

  @Post('test-message')
  @ApiOperation({
    summary: 'Тест отправки сообщения',
    description: 'Тестовая отправка сообщения в Telegram',
  })
  async testMessage(@Body() body: { chatId: string; message: string }) {
    return {
      message: 'Test endpoint - implement actual Telegram sending here',
      chatId: body.chatId,
      messageText: body.message,
    };
  }
}
