import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddTaskCommentController } from './add-task-comment.controller';
import { AddTaskCommentService } from './add-task-comment.service';

@Module({
  imports: [ConfigModule],
  controllers: [AddTaskCommentController],
  providers: [AddTaskCommentService],
  exports: [AddTaskCommentService],
})
export class AddTaskCommentModule {}
