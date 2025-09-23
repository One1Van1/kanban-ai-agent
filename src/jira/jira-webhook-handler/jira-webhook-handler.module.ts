import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JiraWebhookHandlerController } from './jira-webhook-handler.controller';
import { JiraWebhookHandlerService } from './jira-webhook-handler.service';

@Module({
  imports: [ConfigModule],
  controllers: [JiraWebhookHandlerController],
  providers: [JiraWebhookHandlerService],
  exports: [JiraWebhookHandlerService],
})
export class JiraWebhookHandlerModule {}
