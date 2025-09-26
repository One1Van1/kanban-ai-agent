import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProcessWebhookBeforeAfterController } from './process-webhook-before-after.controller';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000, // 1 минута для HTTP запросов
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  controllers: [ProcessWebhookBeforeAfterController],
  providers: [ProcessWebhookBeforeAfterService],
  exports: [ProcessWebhookBeforeAfterService],
})
export class ProcessWebhookBeforeAfterModule {}
