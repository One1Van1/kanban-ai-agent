import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { KanbanService } from './kanban.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [KanbanService],
  exports: [KanbanService],
})
export class KanbanModule {}
