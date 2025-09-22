import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoveTaskController } from './move-task.controller';
import { MoveTaskService } from './move-task.service';

@Module({
  imports: [ConfigModule],
  controllers: [MoveTaskController],
  providers: [MoveTaskService],
  exports: [MoveTaskService],
})
export class MoveTaskModule {}
