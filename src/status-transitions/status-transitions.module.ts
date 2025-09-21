import { Module } from '@nestjs/common';
import { StatusTransitionService } from './status-transition.service';
import { KanbanModule } from '../kanban';

@Module({
  imports: [KanbanModule],
  providers: [StatusTransitionService],
  exports: [StatusTransitionService],
})
export class StatusTransitionsModule {}
