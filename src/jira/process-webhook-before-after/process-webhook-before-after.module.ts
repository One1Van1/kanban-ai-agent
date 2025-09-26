import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessWebhookBeforeAfterController } from './process-webhook-before-after.controller';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';

@Module({
  imports: [ConfigModule],
  controllers: [ProcessWebhookBeforeAfterController],
  providers: [ProcessWebhookBeforeAfterService],
  exports: [ProcessWebhookBeforeAfterService],
})
export class ProcessWebhookBeforeAfterModule {}
