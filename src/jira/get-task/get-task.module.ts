import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetTaskController } from './get-task.controller';
import { GetTaskService } from './get-task.service';

@Module({
  imports: [ConfigModule],
  controllers: [GetTaskController],
  providers: [GetTaskService],
  exports: [GetTaskService],
})
export class GetTaskModule {}
