import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { TaskHistory } from '../../entities/task-history.entity';

// GET Controllers and Services
import { GetTaskDetailsController } from './GET/get-task-details/get-task-details.controller';
import { GetTaskDetailsService } from './GET/get-task-details/get-task-details.service';
import { GetTasksByColumnController } from './GET/get-tasks-by-column/get-tasks-by-column.controller';
import { GetTasksByColumnService } from './GET/get-tasks-by-column/get-tasks-by-column.service';
import { GetBoardStructureController } from './GET/get-board-structure/get-board-structure.controller';
import { GetBoardStructureService } from './GET/get-board-structure/get-board-structure.service';

// POST Controllers and Services
import { CreateTaskController } from './POST/create-task/create-task.controller';
import { CreateTaskService } from './POST/create-task/create-task.service';
import { AssignTaskController } from './POST/assign-task/assign-task.controller';
import { AssignTaskService } from './POST/assign-task/assign-task.service';
import { AddTaskCommentController } from './POST/add-task-comment/add-task-comment.controller';
import { AddTaskCommentService } from './POST/add-task-comment/add-task-comment.service';

// PATCH Controllers and Services
import { MoveTaskToColumnController } from './PATCH/move-task-to-column/move-task-to-column.controller';
import { MoveTaskToColumnService } from './PATCH/move-task-to-column/move-task-to-column.service';
import { ChangeTaskStatusController } from './PATCH/change-task-status/change-task-status.controller';
import { ChangeTaskStatusService } from './PATCH/change-task-status/change-task-status.service';

// PATCH Controllers and Services
import { UpdateTaskController } from './PATCH/update-task/update-task.controller';
import { UpdateTaskService } from './PATCH/update-task/update-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskHistory])],
  controllers: [
    // GET Controllers
    GetTaskDetailsController,
    GetTasksByColumnController,
    GetBoardStructureController,
    // POST Controllers
    CreateTaskController,
    AssignTaskController,
    AddTaskCommentController,
    // PATCH Controllers
    MoveTaskToColumnController,
    ChangeTaskStatusController,
    UpdateTaskController,
  ],
  providers: [
    // GET Services
    GetTaskDetailsService,
    GetTasksByColumnService,
    GetBoardStructureService,
    // POST Services
    CreateTaskService,
    AssignTaskService,
    AddTaskCommentService,
    // PATCH Services
    MoveTaskToColumnService,
    ChangeTaskStatusService,
    UpdateTaskService,
  ],
  exports: [
    // Export services if needed by other modules
    GetTaskDetailsService,
    GetTasksByColumnService,
    GetBoardStructureService,
    CreateTaskService,
    AssignTaskService,
    AddTaskCommentService,
    MoveTaskToColumnService,
    ChangeTaskStatusService,
    UpdateTaskService,
  ],
})
export class KanbanManagementModule {}
