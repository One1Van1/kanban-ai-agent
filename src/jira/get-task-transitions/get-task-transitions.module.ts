import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetTaskTransitionsController } from './get-task-transitions.controller';
import { GetTaskTransitionsService } from './get-task-transitions.service';

@Module({
  imports: [ConfigModule],
  controllers: [GetTaskTransitionsController],
  providers: [GetTaskTransitionsService],
  exports: [GetTaskTransitionsService],
})
export class GetTaskTransitionsModule {}
