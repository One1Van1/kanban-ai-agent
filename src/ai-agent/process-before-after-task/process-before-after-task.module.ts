import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProcessBeforeAfterTaskController } from './process-before-after-task.controller';
import { ProcessBeforeAfterTaskService } from './process-before-after-task.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000, // 1 минута для HTTP запросов
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  controllers: [ProcessBeforeAfterTaskController],
  providers: [ProcessBeforeAfterTaskService],
  exports: [ProcessBeforeAfterTaskService],
})
export class ProcessBeforeAfterTaskModule {}
