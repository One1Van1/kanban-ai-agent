import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetColumnTasksController } from './get-column-tasks.controller';
import { GetColumnTasksService } from './get-column-tasks.service';

@Module({
  imports: [ConfigModule],
  controllers: [GetColumnTasksController],
  providers: [GetColumnTasksService],
  exports: [GetColumnTasksService],
})
export class GetColumnTasksModule {}
