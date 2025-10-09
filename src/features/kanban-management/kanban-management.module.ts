import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { TaskHistory } from '../../entities/task-history.entity';

// GET Controllers and Services
import { GetTaskDetailsController } from './GET/get-task-details/get-task-details.controller';
import { GetTaskDetailsService } from './GET/get-task-details/get-task-details.service';
import { GetTasksByColumnController } from './GET/get-tasks-by-column/get-tasks-by-column.controller';
import { GetTasksByColumnService } from './GET/get-tasks-by-column/get-tasks-by-column.service';

// POST Controllers and Services
import { CreateTaskController } from './POST/create-task/create-task.controller';
import { CreateTaskService } from './POST/create-task/create-task.service';

// PATCH Controllers and Services
import { MoveTaskToColumnController } from './PATCH/move-task-to-column/move-task-to-column.controller';
import { MoveTaskToColumnService } from './PATCH/move-task-to-column/move-task-to-column.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskHistory])],
  controllers: [
    // GET Controllers
    GetTaskDetailsController,
    GetTasksByColumnController,
    // POST Controllers
    CreateTaskController,
    // PATCH Controllers
    MoveTaskToColumnController,
  ],
  providers: [
    // GET Services
    GetTaskDetailsService,
    GetTasksByColumnService,
    // POST Services
    CreateTaskService,
    // PATCH Services
    MoveTaskToColumnService,
  ],
  exports: [
    // Export services if needed by other modules
    GetTaskDetailsService,
    GetTasksByColumnService,
    CreateTaskService,
    MoveTaskToColumnService,
  ],
})
export class KanbanManagementModule {}
