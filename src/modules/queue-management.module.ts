import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CreateTaskQueueController } from '../features/queue-management/create-task-queue/create-task-queue.controller';
import { CreateTaskQueueService } from '../features/queue-management/create-task-queue/create-task-queue.service';
import { GetQueueStatusController } from '../features/queue-management/get-queue-status/get-queue-status.controller';
import { GetQueueStatusService } from '../features/queue-management/get-queue-status/get-queue-status.service';
import { GetJobDetailsController } from '../features/queue-management/get-job-details/get-job-details.controller';
import { GetJobDetailsService } from '../features/queue-management/get-job-details/get-job-details.service';
import { ProcessTaskQueueProcessor } from '../features/queue-management/process-task-queue/process-task-queue.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.redis.host'),
          port: configService.get('queue.redis.port'),
          password: configService.get('queue.redis.password'),
          username: configService.get('queue.redis.username'),
          db: configService.get('queue.redis.db'),
        },
        defaultJobOptions: configService.get('queue.defaultJobOptions'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'ai-agent-tasks',
    }),
  ],
  controllers: [
    CreateTaskQueueController,
    GetQueueStatusController,
    GetJobDetailsController,
  ],
  providers: [
    CreateTaskQueueService,
    GetQueueStatusService,
    GetJobDetailsService,
    ProcessTaskQueueProcessor,
  ],
  exports: [
    CreateTaskQueueService,
    GetQueueStatusService,
    GetJobDetailsService,
  ],
})
export class QueueManagementModule {}
