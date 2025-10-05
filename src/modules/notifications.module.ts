import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendEmailController } from '../features/notifications/send-email/send-email.controller';
import { SendEmailService } from '../features/notifications/send-email/send-email.service';
import { SendTelegramController } from '../features/notifications/send-telegram/send-telegram.controller';
import { SendTelegramService } from '../features/notifications/send-telegram/send-telegram.service';
import notificationsConfig from '../config/notifications.config';

@Module({
  imports: [ConfigModule.forFeature(notificationsConfig)],
  controllers: [SendEmailController, SendTelegramController],
  providers: [SendEmailService, SendTelegramService],
  exports: [SendEmailService, SendTelegramService],
})
export class NotificationsModule {}
