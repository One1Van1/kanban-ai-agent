import { Module } from '@nestjs/common';
import { TaskExecutorService } from './task-executor.service';
import { TaskExecutorController } from './task-executor.controller';
import { CodeGeneratorService } from './services/code-generator.service';

@Module({
  controllers: [TaskExecutorController],
  providers: [TaskExecutorService, CodeGeneratorService],
  exports: [TaskExecutorService],
})
export class TaskExecutorModule {}
